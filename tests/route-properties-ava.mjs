import test from "ava";
import { SkeletonRoute } from "../src/routes.mjs";

function rpt(t, route, object, expected) {
  t.deepEqual(route.propertiesFor(object), expected);
}
rpt.title = (providedTitle = "", route, object, expected) =>
  `router propertiesFor ${providedTitle} '${route.path}' ${JSON.stringify(
    object
  )} ${JSON.stringify(expected)}`.trim();

const route1 = new SkeletonRoute("", {
  propertyMapping: { repository: "name", id: "id" }
});

test(
  rpt,
  route1,
  { name: "r", id: 7 },
  {
    repository: "r",
    id: "7"
  }
);

test(rpt, route1, undefined, undefined);
test(rpt, route1, { name: "r" }, undefined);

const nestedPropsRoute = new SkeletonRoute("/group", {
  parent: new SkeletonRoute("/detail"),
  propertyMapping: { repository: "name", group: "group.name" }
});

test(
  rpt,
  nestedPropsRoute,
  { name: "r", group: { name: "g" } },
  {
    group: "g",
    repository: "r"
  }
);

test(rpt, nestedPropsRoute, undefined, undefined);

test(
  rpt,
  new SkeletonRoute("/deep", {
    propertyMapping: { deep: "a.b.c.d" }
  }),
  {},
  undefined
);
