# Browser regression tests

Run `npm run build` and then `npm run test:e2e`. Playwright starts the production server on `http://127.0.0.1:3000` when no server is running. During local development it can reuse an existing server on that address. CI requires its own server.

The suite runs Chromium with two workers and no retries. It covers:

- Contact form labels, autocomplete, required fields, consent, pending state, duplicate submission, success, retry, and inline errors for HTTP 503 and 429.
- Native browser rejection of phone numbers with 9 or 16 digits without any API request.
- Mobile navigation state, keyboard access, Escape, focus restoration, body scrolling, and anchor positioning.
- Server-rendered institutional content, anchor navigation, contact fallback, and POST form semantics with JavaScript disabled.
- Client area without password collection or Formspree requests.
- Skip navigation, route titles, unique H1, descriptions, canonical URLs, robots, and sitemap.
- Horizontal overflow at 320, 390, 768, 1024, and 1440 px across all five public routes.
- Axe checks for WCAG 2 A/AA and WCAG 2.1 A/AA on every route, without ignored violations.

## Safe network boundary

The automatic browser-context fixture intercepts every `/api/contact` request and supplies a mock response. Other external HTTP requests are blocked, including Formspree and third-party widgets. Tests never send real emails. The default contact mock fails closed with HTTP 503; individual tests explicitly choose their response. Service workers are disabled to preserve routing interception.

## Validation evidence

Validation on 2026-10-19 passed 109 unit/integration tests and 27 Chromium E2E tests, with two browser workers, no retries, and no skips. The instrumented unit coverage exceeds the 80% thresholds. The E2E suite verifies the five public routes, five viewport widths, consent and form recovery, keyboard navigation, canonical metadata, and the JavaScript-disabled fallback.

TDD reproductions before implementation included eight failing interface cases, 52 failures in the first 58 contact API cases, five incorrect icon dimensions, and four TradingView integration cases. Those failures informed the fixes; the completed suite verifies the resulting behavior. Initial runs overlapping implementation are not treated as a snapshot of the original website.

The ticker integration has deterministic cases for the original symbols/settings, an allowed provider iframe, and provider failure. A separate live smoke confirmed real USD/BRL, USDT/BRL and BTC/USDT content with a dark transparent theme, full heights of 58 px on desktop and 84 px on mobile, and no horizontal overflow.

Screenshots, retained failure traces, JSON results, axe attachments, and the HTML report are generated below `test-results/`. These E2E results complement source-code coverage; they do not themselves measure it. The original legal footer is preserved and the version/publication badge is absent.

Email delivery and live infrastructure are not certified by these checks. Contact calls are always mocked; general accessibility audits run with third-party code blocked and do not assess the live provider's iframe internals. Verify production credentials, sender domain, Redis and the trusted origin in an isolated deployment before promoting this branch.
