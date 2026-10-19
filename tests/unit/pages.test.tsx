// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';
import Privacy, { metadata as privacyMeta } from '@/app/privacy/page';
import Terms, { metadata as termsMeta } from '@/app/terms/page';
import Comunicado, { metadata as comunicadoMeta } from '@/app/comunicado/page';

describe('Conteúdo institucional', () => {
  it('oferece soluções, processo, contato e navegação com landmarks próprios', () => {
    render(<Home />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const main = screen.getByRole('main');
    expect(main.querySelector('header')).toBeNull();
    expect(main.querySelector('footer')).toBeNull();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    for (const id of ['solucoes','como-funciona','seguranca','contato','faq']) expect(document.getElementById(id)).toBeInTheDocument();
    expect(document.querySelectorAll('details')).toHaveLength(4);
    expect(document.querySelector('script[src*="tradingview"]')).not.toBeNull();
    expect(screen.getByRole('complementary', { name: 'Cotações de mercado' })).toBeInTheDocument();
  });
  it.each([
    [Privacy,privacyMeta,'Política de Privacidade','/privacy'],
    [Terms,termsMeta,'Termos de Uso','/terms'],
    [Comunicado,comunicadoMeta,'Comunicado Institucional','/comunicado'],
  ] as const)('apresenta página e metadados únicos: %s', (Page, metadata, title, canonical) => {
    render(<Page />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(metadata.title).toBe(title);
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(screen.getByRole('link', { name: /Voltar/ })).toHaveAttribute('href','/');
  });
});
