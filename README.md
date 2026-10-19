# BAGLOBAL

Site institucional em português para apresentação das soluções e contato comercial. Next.js App Router, React, TypeScript e Tailwind CSS. A rota `/login` oferece orientação para atendimento; não existe autenticação ou coleta de senha neste projeto.

## Desenvolvimento local

Use Node.js 22.13+ (CI em Node 22) e npm 10+.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000. O site pode ser visualizado sem credenciais; o envio real de contato exige a configuração abaixo. Não execute testes com credenciais de produção.

## Contato e configuração

| Variável | Uso |
| --- | --- |
| `SITE_URL` | Origem oficial completa, com HTTPS em produção, por exemplo `https://baglobal.com.br`. Precisa corresponder ao domínio usado no navegador. `NEXT_PUBLIC_SITE_URL` é aceito como alternativa. |
| `RESEND_API_KEY` | Chave de envio mantida apenas no servidor. |
| `RESEND_FROM_EMAIL` | E-mail remetente ou `BAGLOBAL <email@dominio-verificado>` com domínio verificado no Resend. |
| `ADMIN_EMAIL` | Destinatário comercial, confirmado pelo responsável. |
| `UPSTASH_REDIS_REST_URL` | Endpoint HTTPS do Redis compartilhado usado para limitar envios em produção. |
| `UPSTASH_REDIS_REST_TOKEN` | Token do Redis, apenas no servidor. |

`POST /api/contact` aceita JSON com `nome`, `empresa`, `email`, `whatsapp`, `necessidade`, `consentimento: true` e `website: ""` (honeypot). Campos extras são descartados. O servidor valida tipos, limites e origem; recusa corpos acima de 16 KiB; envia texto puro e confirma sucesso somente após o provedor confirmar o e-mail. A interface preserva os dados em falhas e oferece contato por e-mail.

A limitação é de 5 tentativas por 10 minutos. Desenvolvimento/testes utilizam memória com TTL e limite de entradas. Produção exige Redis persistente; indisponibilidade ou configuração incompleta devolve 503, sem afetar páginas institucionais. Na Vercel, o IP é lido somente do cabeçalho sobrescrito pela plataforma (`x-vercel-forwarded-for`, `VERCEL=1`). Em outro proxy, todos compartilham um bucket conservador até implementar um adaptador de IP confiável. Não confiar indiscriminadamente em `X-Forwarded-For`.

## Qualidade

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
```

Os testes unitários e de integração simulam Resend/Redis. Os E2E simulam o contato e bloqueiam terceiros; nenhum teste envia e-mail real. A cobertura mínima das quatro métricas é 80%. `npm run check` combina lint, tipos, cobertura e build. Os testes do navegador devem rodar contra o build de produção, sem servidor de desenvolvimento concorrente na porta 3000.

A CI verifica dependências de produção, lint, tipos, cobertura, build e E2E em pull requests e pushes para `main` ou `chore/**`. Os artefatos ficam em `coverage/` e `test-results/`, ignorados pelo Git.

## Cache, disponibilidade e publicação

As páginas institucionais são geradas estaticamente no build. Não há middleware/proxy que personalize cada página ou que impeça cache de HTML. Imagens importadas usam nomes com hash e assets do Next podem aproveitar cache imutável; mudanças geram novas URLs, evitando servir imagem antiga após atualização. A API usa `Cache-Control: no-store` para respostas com dados de contato.

Os cabeçalhos protegem contra enquadramento, MIME sniffing, permissões desnecessárias, referência e submissão para outros sites. A CSP é parcial: restringe base, objetos, frames, atributos de script, formulários, imagens, fontes e conexões. Ela não restringe scripts de elemento, pois o Next inclui scripts inline no HTML estático; não é uma CSP completa contra XSS. A escolha mantém a geração estática e evita uma exceção ampla `unsafe-inline` para scripts. O ticker original do TradingView carrega automaticamente no navegador, de forma assíncrona, com USD/BRL, USDT/BRL e BTC/USDT. A CSP permite somente o host oficial do iframe (`https://www.tradingview-widget.com`), sem liberar iframes de outras origens. O componente reserva altura mínima, limpa a instância ao desmontar e oferece um link alternativo apenas se o script falhar. A página institucional continua estática; a atualização das cotações depende do serviço TradingView.

Antes de promover a manutenção para produção:

1. Revogar a chave Resend anteriormente exposta no histórico, investigar uso e configurar uma substituta restrita na hospedagem. A exclusão local não revoga a chave nem apaga o histórico.
2. Configurar remetente e destinatário corretos, origem oficial e Redis; testar o contato em ambiente de homologação com destinatário autorizado.
3. Revisar o preview e os resultados dos checks. Fazer um deployment de preview isolado, sem trocar o domínio de produção.
4. Validar ambiente, DNS, redirects e cabeçalhos na plataforma. Promover um artefato aprovado com o deployment anterior disponível para rollback. Conferir a home, rotas institucionais e contato após a promoção.

O repositório não contém infraestrutura de SLA, monitoramento externo ou configuração de conta Vercel. Disponibilidade contínua exige monitoramento da hospedagem, alertas e capacidade de rollback. Falhas do e-mail/Redis retornam erro apenas no formulário, enquanto o conteúdo estático e os canais diretos continuam disponíveis.

O texto jurídico do rodapé foi preservado por solicitação do responsável. A indicação de versão/publicação foi removida a pedido. As declarações regulatórias e demais condições comerciais precisam de validação do responsável antes de uma publicação; esta revisão técnica não confirma a situação de autorização da empresa.

## Assets e manutenção

`npm run assets:optimize` regenera favicons nas dimensões declaradas, hero WebP e imagem social a partir dos assets de marca. O script utiliza Sharp; instale as dependências de desenvolvimento para executá-lo. Os arquivos gerados devem acompanhar qualquer atualização dos assets. A identidade escura/laranja e a fonte Inter foram preservadas.

Use `npm audit` para revisar também ferramentas de desenvolvimento. Existem cinco alertas altos na cadeia `braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next` na auditoria desta manutenção. `npm audit fix --force` propõe downgrade incompatível do framework de lint; não aplicar sem avaliar compatibilidade. A auditoria de produção foi tratada separadamente.
