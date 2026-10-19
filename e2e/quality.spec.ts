import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const routes = ["/", "/login", "/privacy", "/terms", "/comunicado"] as const;

for (const path of routes) {
  test(`acessibilidade WCAG AA: ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await testInfo.attach("axe-results", {
      body: JSON.stringify(result, null, 2),
      contentType: "application/json",
    });
    expect(result.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    }))).toEqual([]);
  });
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`páginas não têm transbordamento horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await test.step(path, async () => {
        await page.goto(path);
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(dimensions.document, `document overflow: ${path}`).toBeLessThanOrEqual(dimensions.viewport + 1);
        expect(dimensions.body, `body overflow: ${path}`).toBeLessThanOrEqual(dimensions.viewport + 1);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      });
    }
  });
}

test("rotas têm título próprio, H1 único, descrição e URL canônica de produção", async ({ page }) => {
  let titles: readonly string[] = [];
  for (const path of routes) {
    await test.step(path, async () => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const title = await page.title();
      expect(title).not.toBe("");
      expect(titles).not.toContain(title);
      titles = [...titles, title];
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const url = new URL((await canonical.getAttribute("href"))!);
      expect(url.origin).toBe("https://baglobal.com.br");
      expect(url.pathname.replace(/\/$/, "") || "/").toBe(path);
    });
  }
});

test("robots e sitemap publicados incluem páginas institucionais", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("https://baglobal.com.br/sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const path of ["/privacy", "/terms", "/comunicado"]) {
    expect(xml).toContain(`https://baglobal.com.br${path}`);
  }
});
