import test from "ava";
import { BaseRouter } from "../src/base-router.mjs";
import { MasterRoute } from "../src/master-route.mjs";
import {} from "./helpers/fake-browser.mjs";


test.serial("router basics", t => {
  const router = new BaseRouter([], "/base");
  t.is(router.base, "/base", "given base");
  t.is(router.path, "", "empty path");
  t.deepEqual(router.params, {}, "no params");
  t.is(router.route, undefined, "no route");
  t.is(router.component, undefined, "no component");
  t.is(router.searchParams.get("q"), null);
});

test.serial("push encoded path", async t => {
  const router = new BaseRouter([], "");

  await router.push("/%20with%20spaces?q=a");

  t.is(router.path, "/ with spaces?q=a");
  t.is(router.searchParams.get("q"), "a");
});

test.serial("router set path", async t => {
  const router = new BaseRouter([new MasterRoute("/aRoute")], "");
  router.path = "/aRoute";
  t.is(router.path, "/aRoute");
  t.is(router.state.route.path, "/aRoute");
});

test.serial("router replace", async t => {
  const router = new BaseRouter([new MasterRoute("/aRoute")], "");
  await router.replace("/aRoute");
  t.is(router.path, "/aRoute");
  t.is(router.state.route.path, "/aRoute");
});

test.serial("replace encoded path", async t => {
  const router = new BaseRouter([new MasterRoute("/other spaces")], "");
  await router.replace("/other%20spaces?q=a");
  t.is(router.state.route.path, "/other spaces");
  t.is(router.path, "/other spaces?q=a");
  t.is(router.searchParams.get("q"), "a");
});

test.serial("replace set searchParams", async t => {
  const router = new BaseRouter([new MasterRoute("/other spaces")], "");
  router.path = "/other%20spaces?q=a";

  t.is(router.searchParams.get("q"), "a");

  const searchParams = router.searchParams;

  searchParams.set("q", "b");

  router.searchParams = searchParams;
  t.is(router.path, "/other spaces?q=b");
});

test.serial("delete searchParams empty", async t => {
  const router = new BaseRouter([new MasterRoute("/other spaces")], "");
  router.path = "/other%20spaces?q=a";

  const searchParams = router.searchParams;
  searchParams.delete("q");

  router.searchParams = searchParams;
  t.is(router.path, "/other spaces");
});

test.serial("searchParamsStore", async t => {
  const router = new BaseRouter([new MasterRoute("/other spaces")], "");

  let sp;

  router.searchParamStore.subscribe(params => (sp = params));

  router.path = "/other%20spaces?q=a";

  t.deepEqual(sp, { q: "a" });
});
