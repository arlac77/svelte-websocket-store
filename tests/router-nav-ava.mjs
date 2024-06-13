import test from "ava";
import { setupRouter } from "./helpers/setup.mjs";
import { matcher } from "multi-path-matcher";
import {} from "./helpers/fake-browser.mjs";

async function rtt(t, items) {
  const { router } = setupRouter();

  let subscriptionPath, subscriptionComponent;

  router.subscribe(router => {
    subscriptionPath = router.path;
    subscriptionComponent = router.component;
  });

  const startPath = subscriptionPath;
  const startHistoryLength = history.length;

  t.is(router.path, startPath);
  t.falsy(router.component);
  t.is(subscriptionPath, startPath);

  let n = 0;

  for (const item of items) {
    n++;

    const path = item.path;
    const componentName = item.component;

    t.falsy(router.nested);

    const m = matcher(router.routes, path);

    const properties = {};

    m.route.subscribe(route => {
      if (route) {
        Object.assign(properties, route.value);
        delete properties.leafs;
      }
    });

    switch (item.action) {
      case "back":
        history.back();
        break;
      case "forward":
        history.forward();
        break;

      default:
        const transition = router.push(path);

        t.truthy(router.nested, "transition ongoing");
        t.is(router.nested.path, path);

        await transition;
    }

    if (item.route) {
      if (item.route.properties) {
        t.deepEqual(item.route.properties, properties, "properties");
      }
    }

    t.falsy(router.nested, "transition over");
    t.is(router.path, path, "router path");
    t.is(router.component.name, componentName, "router component");
    t.is(subscriptionPath, path, "subscription path");
    t.is(subscriptionComponent.name, componentName, "subscription component");
    t.is(history.length, startHistoryLength + n, "history length");
    t.is(
      window.location.href.slice(window.location.origin.length),
      path,
      "window path"
    );
  }
}

rtt.title = (providedTitle = "", items) =>
  `router transition ${providedTitle} ${items.map(item => item.path)}}`.trim();

test.serial(rtt, [{ path: "/master", component: "MasterComponent" }]);
test.serial(rtt, [
  {
    path: "/master/1?q=a",
    component: "DetailComponent",
    route: { properties: { id: "1" } }
  },
  {
    path: "/master/2",
    component: "DetailComponent",
    route: { properties: { id: "2" } }
  },
  {
    path: "/master/1",
    component: "DetailComponent",
    route: { properties: { id: "1" } }
  },
  {
    //action: "back",
    path: "/master/2",
    component: "DetailComponent",
    route: { properties: { id: "2" } }
  }
]);
test.serial(rtt, [
  {
    path: "/master/2/filler/d",
    component: "LeafComponent",
    route: {}
  }
]);
