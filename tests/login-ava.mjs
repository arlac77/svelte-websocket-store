import test from "ava";
import { login } from "../src/login.mjs";
import { Session } from "../src/session.mjs";

globalThis.localStorage = {};
globalThis.fetch = async function (url, options) {
  return {
    ok: true,
    json: () => {
      return options.body.length > 30
        ? { access_token: "aaa", refresh_token: "bbb", token_type: "bearer" }
        : {};
    }
  };
};

test("login missing access_token", async t => {
  const session = new Session();
  const message = await login(session, "api", "", "");
  t.is(message, "missing access_token");
  t.false(session.isValid);
});

test("login data present", async t => {
  let data;
  const message = await login(
    {
      update(d) {
        data = d;
      }
    },
    "api",
    "user",
    "secret"
  );

  t.deepEqual(data, {
    access_token: "aaa",
    refresh_token: "bbb",
    username: "user",
    endpoint: "api",
    token_type: 'bearer'
  });
});
