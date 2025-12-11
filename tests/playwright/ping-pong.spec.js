import { test, expect } from "@playwright/test";

test("ping pong", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox", { name: "publish value" }).click();
  await page.getByRole("textbox", { name: "publish value" }).fill("ping");
  await expect(
    page.getByRole("textbox", { name: "back from server" })
  ).toHaveValue(">ping");
});

test("reconnect", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("textbox", { name: "publish value" }).click();
  await page
    .getByRole("textbox", { name: "publish value" })
    .fill("disconnect(10)");

  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "publish value" }).fill("ping");

  await expect(
    page.getByRole("textbox", { name: "back from server" })
  ).toHaveValue(">ping");
});

/*
test("reconnect", async t => {
  await t.navigateTo(`${base}`);

  await t.typeText("#input1", "disconnect(10)", { replace: true });
  await t.wait(2000);
  await t.typeText("#input1", "ping", { replace: true });
  await t.wait(1500);
  await t.expect(Selector("#input2").value).contains(">>ping");
});
*/
