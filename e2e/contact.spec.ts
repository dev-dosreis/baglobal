import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

async function fillContactForm(page: Page) {
  await page.getByLabel(/nome completo/i).fill("Pessoa QA");
  await page.getByLabel(/^empresa/i).fill("Empresa de teste");
  await page.getByLabel(/^e-mail/i).fill("qa@example.com");
  await page.getByLabel(/^whatsapp/i).fill("11999999999");
  await page.getByLabel(/tipo de necessidade/i).selectOption({ label: "Gestão de pagamentos" });
  await page.getByRole("checkbox", { name: /concordo|autorizo/i }).check();
}

test("campos possuem rótulos acessíveis e dados de preenchimento automático", async ({ page }) => {
  await page.goto("/#contato");
  await expect(page.getByLabel(/nome completo/i)).toHaveAttribute("autocomplete", "name");
  await expect(page.getByLabel(/^empresa/i)).toHaveAttribute("autocomplete", "organization");
  await expect(page.getByLabel(/^e-mail/i)).toHaveAttribute("autocomplete", "email");
  await expect(page.getByLabel(/^whatsapp/i)).toHaveAttribute("autocomplete", "tel");
  await expect(page.getByLabel(/tipo de necessidade/i)).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /concordo|autorizo/i })).toHaveAttribute("required", "");
});

test("formulário vazio ou sem consentimento não envia solicitações", async ({ page, contactApi }) => {
  await page.goto("/#contato");
  await page.getByRole("button", { name: "Enviar solicitação", exact: true }).click();
  expect(contactApi.requests()).toHaveLength(0);
  await fillContactForm(page);
  await page.getByRole("checkbox", { name: /concordo|autorizo/i }).uncheck();
  await page.getByRole("button", { name: "Enviar solicitação", exact: true }).click();
  expect(contactApi.requests()).toHaveLength(0);
});

for (const phoneNumber of ["123456789", "1234567890123456"]) {
  test(`telefone com ${phoneNumber.length} dígitos é rejeitado pelo navegador sem chamar a API`, async ({ page, contactApi }) => {
    await page.goto("/#contato");
    await fillContactForm(page);
    const phone = page.getByLabel(/^whatsapp/i);
    await phone.fill(phoneNumber);
    expect(await phone.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
    await page.getByRole("button", { name: "Enviar solicitação", exact: true }).click();
    await expect(phone).toBeFocused();
    expect(contactApi.requests()).toHaveLength(0);
  });
}

test("sucesso anuncia confirmação e permite enviar outra mensagem", async ({ page, contactApi }) => {
  contactApi.respondWith({ status: 200, body: { success: true, message: "Solicitação enviada com sucesso.", id: "qa-mocked" } });
  await page.goto("/#contato");
  await fillContactForm(page);
  await page.getByRole("button", { name: "Enviar solicitação", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(/solicitação enviada/i);
  expect(contactApi.requests()).toHaveLength(1);
  expect(contactApi.requests()[0]).toMatchObject({
    nome: "Pessoa QA",
    empresa: "Empresa de teste",
    email: "qa@example.com",
    whatsapp: "11999999999",
    consentimento: true,
  });
  await page.getByRole("button", { name: /enviar outra mensagem/i }).click();
  await expect(page.getByLabel(/nome completo/i)).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: /concordo|autorizo/i })).not.toBeChecked();
});

for (const status of [503, 429]) {
  test(`erro ${status} aparece no formulário e preserva os dados sem alert`, async ({ page, contactApi }) => {
    let dialogs: readonly string[] = [];
    page.on("dialog", async (dialog) => {
      dialogs = [...dialogs, dialog.message()];
      await dialog.dismiss();
    });
    contactApi.respondWith({
      status,
      headers: status === 429 ? { "Retry-After": "60" } : {},
      body: { error: status === 429 ? "Muitas solicitações. Aguarde e tente novamente." : "Não foi possível enviar. Tente novamente." },
    });
    await page.goto("/#contato");
    await fillContactForm(page);
    await page.getByRole("button", { name: "Enviar solicitação", exact: true }).click();
    await expect(page.locator("#contato").getByRole("alert")).toBeVisible();
    await expect(page.getByLabel(/nome completo/i)).toHaveValue("Pessoa QA");
    await expect(page.getByLabel(/^e-mail/i)).toHaveValue("qa@example.com");
    await expect(page.getByRole("button", { name: "Enviar solicitação", exact: true })).toBeEnabled();
    expect(contactApi.requests()).toHaveLength(1);
    expect(dialogs).toEqual([]);
  });
}

test("envio pendente bloqueia duplo clique e indica progresso", async ({ page, contactApi }) => {
  contactApi.respondWith({ status: 200, body: { success: true, message: "Solicitação enviada com sucesso.", id: "qa-mocked" } });
  const release = contactApi.pause();
  try {
    await page.goto("/#contato");
    await fillContactForm(page);
    await page.getByRole("button", { name: "Enviar solicitação", exact: true }).click({ clickCount: 2 });
    await expect(page.getByRole("button", { name: /enviando/i })).toBeDisabled();
    await expect.poll(() => contactApi.requests().length).toBe(1);
    release();
    await expect(page.getByRole("status")).toContainText(/solicitação enviada/i);
    expect(contactApi.requests()).toHaveLength(1);
  } finally {
    release();
  }
});
