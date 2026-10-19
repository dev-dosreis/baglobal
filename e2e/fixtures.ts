import { test as base, expect } from "@playwright/test";

type MockReply = {
  readonly status: number;
  readonly body: Readonly<Record<string, unknown>>;
  readonly headers?: Readonly<Record<string, string>>;
};

type ContactApi = {
  readonly requests: () => readonly Readonly<Record<string, unknown>>[];
  readonly respondWith: (reply: MockReply) => void;
  readonly pause: () => () => void;
};

export const test = base.extend<{ contactApi: ContactApi }>({
  // The context-wide guard covers every test, including popup requests.
  // No browser request can send a real email or reach a third-party service.
  contactApi: [async ({ context, baseURL }, use) => {
    const origin = new URL(baseURL!).origin;
    let requests: readonly Readonly<Record<string, unknown>>[] = [];
    let reply: MockReply = {
      status: 503,
      body: { error: "Envio indisponível durante este teste." },
    };
    let gate: Promise<void> | undefined;
    let release: (() => void) | undefined;

    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) {
        await route.abort("blockedbyclient");
        return;
      }
      if (url.pathname !== "/api/contact") {
        await route.continue();
        return;
      }

      requests = [...requests, route.request().postDataJSON() ?? {}];
      if (gate) await gate;
      await route.fulfill({
        status: reply.status,
        contentType: "application/json",
        headers: reply.headers,
        body: JSON.stringify(reply.body),
      });
    });

    await use({
      requests: () => requests,
      respondWith: (nextReply) => { reply = nextReply; },
      pause: () => {
        gate = new Promise<void>((resolve) => { release = resolve; });
        return () => { release?.(); };
      },
    });
    release?.();
  }, { auto: true }],
});

export { expect };
