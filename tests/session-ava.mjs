import test from "ava";
import jsonwebtoken from "jsonwebtoken";
import { readFile } from "fs/promises";
import { Session } from "../src/session.mjs";

globalThis.localStorage = {};
globalThis.fetch = async function () {
  return {
    ok: true,
    json: () => {
      return {};
    }
  };
};

const EXPIRES = 3;

test.before(async t => {
  const key = await readFile(new URL("app/demo.rsa", import.meta.url).pathname);

  t.context.key = key;

  t.context.access_token = jsonwebtoken.sign({ entitlements: "a,b,c" }, key, {
    algorithm: "RS256",
    expiresIn: `${EXPIRES}s`
  });

  t.context.refresh_token = jsonwebtoken.sign({ sequence: 1 }, key, {
    algorithm: "RS256",
    expiresIn: "3600s"
  });
});

test("session initiial", t => {
  const session = new Session();
  t.false(session.isValid);
  t.deepEqual(session.authorizationHeader, {});
});

test("session read/write store", t => {
  const store = {
    username: "emil",
    token_type: "bearer",
    access_token: t.context.access_token,
    endpoint: "login"
  };

  const session = new Session(store);

  t.is(session.endpoint, "login");
  t.true(session.isValid);
  t.is(session.username, "emil");
  t.truthy(session.access_token);

  session.username = "hugo";
  t.is(store.username, "hugo");

  session.refresh_token = t.context.refresh_token;
  t.is(store.refresh_token, t.context.refresh_token);

  session.access_token = t.context.access_token;
  t.is(store.access_token, t.context.access_token);
});

test("session invalid token", t => {
  t.false(new Session({ access_token: "A" }).isValid);
  //t.false(new Session({ access_token: "A.eyJpYXQiOjE2Mjk1NzMzMjksImV4cCI6MTYyOTU3NjkyOX0.C" }).isValid);
});

test("session invalidate", t => {
  const store = { username: "emil", access_token: t.context.access_token };

  const session = new Session(store);

  session.invalidate();

  t.false(session.isValid);
  t.is(store.username, undefined);
  t.is(store.refresh_token, undefined);
  t.is(store.access_token, undefined);
});

test("session update", async t => {
  const store = {};

  const data = {
    username: "emil",
    token_type: "bearer",
    expires_in: EXPIRES,
    scope: "a,b,c",
    access_token: t.context.access_token
  };

  const session = new Session(store);

  t.is(session.isValid, false);

  session.update(data);

  t.true(session.isValid);
  t.is(
    session.authorizationHeader.Authorization,
    "Bearer " + session.access_token
  );
  t.true(session.hasEntitlement("a"));
  t.is(store.access_token, data.access_token);
  t.is(store.username, "emil");

  let valid = 77;

  const unsubscribe = session.subscribe(session => {
    valid = session.isValid;
  });

  await new Promise(resolve => setTimeout(resolve, 4000));

  t.is(session.isValid, false);
  t.is(valid, false);
});

test("session subsription", t => {
  const session = new Session();
  let access_token;

  const unsubscribe = session.subscribe(
    session => (access_token = session.access_token)
  );

  session.access_token = "hugo";

  t.is(access_token, "hugo");

  unsubscribe();

  session.access_token = "emit";
  t.is(access_token, "hugo");
});
