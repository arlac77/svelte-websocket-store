import test from "ava";
import { Transition } from "../src/transition.mjs";
import { SkeletonRoute } from "../src/routes.mjs";
import { setupRouter } from "./helpers/setup.mjs";
import {} from "./helpers/fake-browser.mjs";

test("transition basics", async t => {
  const { router } = setupRouter();

  const transition = new Transition(router, "/master");

  t.is(transition.path, "/master");
  t.deepEqual(transition.params, {});

  t.is(transition.searchParams.get("key1"), null);

  await transition.start();

  t.falsy(transition.nested);

  t.is(router.route.path, "/master");
});

test("transition params", async t => {
  const { router } = setupRouter();

  const transition = new Transition(router, "/master/2");

  t.is(transition.path, "/master/2");

  t.deepEqual(transition.params, { detail: "2" });

  await transition.start();

  t.falsy(transition.nested);

  t.is(router.route.path, "/master/:detail");
});

test("transition with query parms", async t => {
  const { router } = setupRouter();

  const transition = new Transition(
    router,
    "/master#id?key1=value1&key2=value2"
  );

  t.is(transition.searchParams.get("key1"), "value1");
  t.is(transition.searchParams.get("key2"), "value2");

  await transition.start();

  t.falsy(transition.nested);

  t.is(router.route.path, "/master");
});

test("transition redirect", async t => {
  const { router, noLoginRequired } = setupRouter();

  const transition = new Transition(router, "/protected");
  const start = transition.start();
  transition.redirect("/login");

  t.truthy(transition.nested);

  noLoginRequired();

  await transition.continue();

  await start;

  t.falsy(transition.nested);

  t.is(router.route.path, "/protected");
});

test("transition redirect + abort", async t => {
  const { router } = setupRouter();

  const transition = new Transition(router, "/protected");

  t.is(transition.path, "/protected");

  const start = transition.start();
  transition.redirect("/login");

  //t.is(transition.path, "/login");

  t.truthy(transition.nested);

  await router.abort();

  t.not(router.route.path, "/protected");

  t.pass("aborted");

  /*try {
      await start;
  }
  catch(e) {
  }*/

  //t.is(transition.nested,undefined);
  //t.is(router.route.path, "/protected");
});

test("route guard", async t => {
  const { router } = setupRouter();

  let parentGuardEntered = false;

  const parent = new SkeletonRoute("/base", {
    guard: {
      toString: () => "test",
      enter: transition => {
        parentGuardEntered = transition;
      }
    }
  });

  const route = new SkeletonRoute("/a", { parent });
  const transition = new Transition(router, "/base/a");
  await route.enter(transition);

  t.deepEqual(parentGuardEntered, transition);
});
