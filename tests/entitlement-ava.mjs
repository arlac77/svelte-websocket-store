import test from "ava";
import { Entitlement } from "../src/entitlement.mjs";

function et(t, initial, expectedName, expectedId = expectedName) {
  const entitlement = new Entitlement(initial);

  t.is(entitlement.name, expectedName, "name");
}

et.title = (providedTitle = "", initial, expectedName) =>
  `Entitlement ${providedTitle} ${JSON.stringify(initial)}`.trim();

test(et, "e1", "e1");
//test(et, { name: "e1" }, "e1");
test(et, { cn: "e1" }, "e1");
test(
  et,
  {
    dn: "cn=system-dashboard.unit.restart,ou=groups,dc=example,dc=de",
    cn: ["system-dashboard", "system-dashboard.unit.restart"]
  },
  "system-dashboard"
);
