import { Selector, ClientFunction } from "testcafe";

test("ping pong", async t => {
  await t.navigateTo(`${base}`);

  await t.typeText("#input1", "ping", { replace: true });
  await t.expect(Selector("#input2").value).eql(">ping");
});
