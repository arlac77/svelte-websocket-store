import test from "ava";
import { Transition } from "../src/transition.mjs";
import { setupRouter } from "./helpers/setup.mjs";
import {} from "./helpers/fake-browser.mjs";

test("route master detail subscription", async t => {
  const { router, detail, model, master } = setupRouter();

  t.deepEqual(master.value, []);

  let detailValue;

  detail.subscribe(route => (detailValue = route.value));

  const transition = new Transition(router, "/master/2");
  t.deepEqual(transition.params, { detail: "2" });

  await transition.start();

  t.deepEqual(detailValue, model.details[1]);
  t.deepEqual(master.value, model.details);
});

test("route master detail leaf subscription", async t => {
  const { router, leaf, model } = setupRouter();

  let leafValue;

  leaf.subscribe(route => (leafValue = route.value));

  const transition = new Transition(router, "/master/2/filler/d");
  t.deepEqual(transition.params, { detail: "2", leaf: "d" });

  await transition.start();

  t.deepEqual(leafValue, model.details[1].leafs[1]);
});
