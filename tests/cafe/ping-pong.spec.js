import { Selector } from "testcafe";

const base = "http://localhost:5173/";

fixture`Getting Started`.page`${base}`;

test("ping pong", async t => {
  await t.navigateTo(`${base}`);

  await t.typeText("#input1", "ping", { replace: true });
  await t.expect(Selector("#input2").value).contains(">>ping");
});

test("reconnect", async t => {
  await t.navigateTo(`${base}`);

  await t.typeText("#input1", "disconnect(10)", { replace: true });
  await t.wait(2000);
  await t.typeText("#input1", "ping", { replace: true });
  await t.wait(1500);
  await t.expect(Selector("#input2").value).contains(">>ping");
});
