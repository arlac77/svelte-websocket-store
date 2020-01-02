import { Selector, ClientFunction } from "testcafe";

const base = "http://localhost:5000/modules/svelte-websocket-store/example";

fixture`Getting Started`.page`${base}/index.html`;

test("ping pong", async t => {
  await t.navigateTo(`${base}`);

  await t.typeText("#input1", "ping", { replace: true });
  await t.expect(Selector("#input2").value).eql(">ping");
});
