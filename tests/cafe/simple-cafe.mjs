import { Selector } from "testcafe";

const base = "http://localhost:5173/";

fixture`Entitlement`.page`${base}`;

test("visible", async t => {
  const title = Selector(".entitlement");
  await t.expect(title.innerText).contains("e1");
});
