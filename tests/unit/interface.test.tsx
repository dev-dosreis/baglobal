// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header, Contact } from '@/components/Sections';
import LoginPage from '@/app/login/page';

afterEach(() => { vi.unstubAllGlobals(); document.body.style.overflow = ''; });

function completeContact() {
  fireEvent.change(screen.getByLabelText(/Nome completo/), { target: { value: 'Maria Silva' } });
  fireEvent.change(screen.getByLabelText(/^Empresa/), { target: { value: 'Empresa Exemplo' } });
  fireEvent.change(screen.getByLabelText(/^E-mail/), { target: { value: 'maria@example.com' } });
  fireEvent.change(screen.getByLabelText(/^WhatsApp/), { target: { value: '+55 (11) 99999-9999' } });
  fireEvent.click(screen.getByRole('checkbox'));
}

describe('Navegação acessível', () => {
  it('expõe o estado do menu, fecha com Escape e devolve foco', async () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(toggle).toHaveFocus());
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.body.style.overflow).toBe('');
  });

  it('mantém o ciclo de foco no menu e fecha ao voltar para desktop', () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    fireEvent.click(toggle);
    const nav = screen.getByRole('navigation', { name: 'Navegação móvel' });
    const links = nav.querySelectorAll('a');
    expect(links[0]).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(toggle).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(links[links.length - 1]).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(toggle).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(links[0]).toHaveFocus();
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    fireEvent.resize(window);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
  });

  it('fecha o menu ao escolher uma seção', () => {
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    fireEvent.click(screen.getByRole('navigation', { name: 'Navegação móvel' }).querySelector('a')!);
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Contato comercial', () => {
  it('associa rótulos, instruções e consentimento aos campos', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/Nome completo/)).toHaveAttribute('autocomplete', 'name');
    expect(document.querySelector('form')).toHaveAttribute('method', 'post');
    expect(screen.getByLabelText(/^Empresa/)).toHaveAttribute('autocomplete', 'organization');
    expect(screen.getByLabelText(/^E-mail/)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^WhatsApp/)).toHaveAttribute('autocomplete', 'tel');
    expect(screen.getByLabelText(/Tipo de necessidade/)).toBeRequired();
    expect(screen.getByRole('checkbox', { name: /autorizo o contato/i })).toBeRequired();
  });

  it('envia consentimento real e honeypot e anuncia sucesso confirmado', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    render(<Contact />); completeContact();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitação' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Solicitação enviada');
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toMatchObject({ nome: 'Maria Silva', consentimento: true, website: '' });
    expect(sent).not.toHaveProperty('user_agent');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar outra mensagem' }));
    expect(screen.getByLabelText(/Nome completo/)).toHaveValue('');
  });

  it('preserva os dados e oferece recuperação na falha do serviço', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 503 })));
    render(<Contact />); completeContact();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitação' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/enviar|indisponível/i);
    expect(screen.getByLabelText(/Nome completo/)).toHaveValue('Maria Silva');
    expect(screen.getByRole('button', { name: 'Enviar solicitação' })).toBeEnabled();
  });

  it('impede envio duplicado enquanto aguarda resposta', async () => {
    let resolveRequest!: (value: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => { resolveRequest = resolve; }));
    vi.stubGlobal('fetch', fetchMock);
    render(<Contact />); completeContact();
    const submit = screen.getByRole('button', { name: 'Enviar solicitação' });
    fireEvent.click(submit); fireEvent.click(submit);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(submit).toBeDisabled();
    await act(async () => { resolveRequest(new Response(JSON.stringify({ success: true }), { status: 200 })); });
  });

  it('orienta a aguardar quando há excesso de solicitações', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));
    render(<Contact />); completeContact();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitação' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Aguarde alguns minutos');
    expect(screen.getByLabelText(/Nome completo/)).toHaveValue('Maria Silva');
  });

  it('não apresenta sucesso se o serviço não confirmar o recebimento', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
    render(<Contact />); completeContact();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitação' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('lida com falha de rede sem perder o formulário', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network failed')));
    render(<Contact />); completeContact();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitação' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-mail/)).toHaveValue('maria@example.com');
  });
});

it('orienta clientes sem coletar senha nem apresentar autenticação fictícia', () => {
  render(<LoginPage />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Área do cliente');
  expect(document.querySelector('input[type="password"]')).toBeNull();
  expect(screen.getByRole('link', { name: /Falar com a equipe/ })).toHaveAttribute('href', '/#contato');
});
