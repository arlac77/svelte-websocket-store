import test from "ava";
import { compile } from "multi-path-matcher";
import { SkeletonRoute } from "../src/routes.mjs";


test("route constructor", t => {
  const guard = {};
  const route = new SkeletonRoute("/a", { guard, $$scope: {}, $$slots: {} });
  compile([route]);
  t.is(route.path, "/a");
  t.is(route.guard, guard);
  t.is(route["$$scope"], undefined);
  t.is(route["$$slots"], undefined);
  t.is(route.objectInstance, Object);
  t.is(route.hasParams, false);
});

test("route constructor with params", t => {
  const route = new SkeletonRoute("/:key", {});
  compile([route]);
  t.is(route.path, "/:key");
  t.is(route.hasParams, true);
});

test("route pathFor", t => {
  const route = new SkeletonRoute("/:key", { propertyMapping: { key: "key" } });
  compile([route]);
  t.is(route.pathFor({ key: "77" }, "#suffix"), "/77#suffix");
});

test("route pathFor unknown", t => {
  const route = new SkeletonRoute("/:key", { propertyMapping: { key: "key" } });
  compile([route]);
  t.is(route.pathFor({ something: "else" }, "#suffix"), undefined);
});

test("route path", t => {
  const parent = new SkeletonRoute("/a");
  const route = new SkeletonRoute("/b", { parent });

  t.is(parent.path, "/a");
  t.is(route.parent, parent);
  t.is(route.path, "/a/b");
});

test("route common ancestor", t => {
  const parent = new SkeletonRoute("/parent");
  t.is(parent.commonAncestor(parent), parent);
  t.is(parent.commonAncestor(), undefined);

  const routeA = new SkeletonRoute("/a", { parent });
  t.is(routeA.commonAncestor(parent), parent);

  const routeB = new SkeletonRoute("/b", { parent });
  t.is(routeB.commonAncestor(routeA), parent);
});

test("route valueFor", t => {
  const object = { x: 77 };

  const parent = new SkeletonRoute("/a", {
    valueFor: properties => {
      return object;
    }
  });

  const route = new SkeletonRoute("/b", { parent });

  t.deepEqual(route.valueFor({ repository: "repo1" }), object);
  t.deepEqual(parent.valueFor({ repository: "repo1" }), object);
});

test("route objectInstance", t => {
  const parent = new SkeletonRoute();
  t.is(parent.objectInstance, Object);

  const child = new SkeletonRoute("c", { parent, objectInstance: Date });
  t.is(child.objectInstance, Date);
});

test("route subscription", t => {
  const route = new SkeletonRoute();
  let changed, routeValue;

  route.subscribe(r => {
    routeValue = route.value;
    changed = r.value;
  });

  route.value = 4711;

  t.is(changed, 4711);
  t.is(routeValue, 4711);
});
