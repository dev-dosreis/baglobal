import { test, expect } from "./fixtures";

test("menu móvel informa estado, fecha com Escape e restaura foco e rolagem", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu", exact: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  const menuId = await toggle.getAttribute("aria-controls");
  expect(menuId).toBeTruthy();
  await toggle.click();
  const close = page.getByRole("button", { name: "Fechar menu", exact: true });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`[id="${menuId}"]`)).toBeVisible();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  await page.keyboard.press("Tab");
  expect(await page.evaluate((id) => document.getElementById(id!)?.contains(document.activeElement) ?? false, menuId)).toBe(false);
});

test("âncora no menu móvel fecha navegação e mostra destino abaixo do cabeçalho", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu", exact: true });
  const menuId = await toggle.getAttribute("aria-controls");
  await toggle.click();
  await page.locator(`[id="${menuId}"]`).getByRole("link", { name: "Contato", exact: true }).click();
  await expect(page).toHaveURL(/#contato$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => page.evaluate(() => {
    const section = document.getElementById("contato")!.getBoundingClientRect();
    const header = document.querySelector("header")!.getBoundingClientRect();
    return section.top >= header.bottom - 1 && section.top < innerHeight;
  })).toBe(true);
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
});

test("área do cliente oferece contato sem coletar senha nem chamar Formspree", async ({ page }) => {
  let credentialRequests: readonly string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("formspree.io")) credentialRequests = [...credentialRequests, request.url()];
  });
  await page.goto("/login");
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("link", { name: /contato|especialista|gerente|fale/i }).first()).toBeVisible();
  expect(credentialRequests).toEqual([]);
});

test("atalho de teclado permite pular para o conteúdo principal", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: /pular para (o )?conteúdo/i });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test.describe("navegação sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("conteúdo e âncoras continuam disponíveis e formulário usa POST", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: "Ver soluções", exact: true }).click();
    await expect(page).toHaveURL(/#solucoes$/);
    await expect(page.locator("#solucoes")).toBeInViewport();
    const contactForm = page.locator("#contato form");
    await expect(contactForm).toHaveAttribute("method", "post");
    await expect(contactForm).toHaveAttribute("action", "/api/contact");
    await expect(contactForm.getByLabel(/nome completo/i)).toBeVisible();
    await expect(contactForm.locator('a[href="mailto:contato@baglobal.com.br"]')).toBeVisible();
  });
});
