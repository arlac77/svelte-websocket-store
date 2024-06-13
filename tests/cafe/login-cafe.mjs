import { Selector } from "testcafe";

const base =
  "http://localhost:5173/";

fixture`login`.page`${base}`;

test("correct credentials", async t => {
  await t
    .typeText("#username", "user")
    .typeText("#password", "secret")
    .click("button");
  await t.expect(Selector("#session_username").innerText).eql("user");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
  await t.expect(Selector("#session_entitlements").innerText).eql("a,b,c");
  await t.expect(Selector("#session_subscriptions").innerText).eql("1");
});

test("no entitlements in token", async t => {
  await t
    .typeText("#username", "user_no_entitlements")
    .typeText("#password", "secret")
    .click("button");
  await t.expect(Selector("#session_username").innerText).eql("user_no_entitlements");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
  await t.expect(Selector("#session_subscriptions").innerText).eql("1");
});

test("correct credentials + invalidate", async t => {
  await t
    .typeText("#username", "user")
    .typeText("#password", "secret")
    .click("button");
  await t.expect(Selector("#session_username").innerText).eql("user");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
  await t.expect(Selector("#session_entitlements").innerText).eql("a,b,c");
  await t.click("#logoff");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
});

test("correct credentials expiring with refresh", async t => {
  await t
    .typeText("#username", "user")
    .typeText("#password", "secret")
    .click("button");
  await t.expect(Selector("#session_username").innerText).eql("user");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
  await t.wait(16 * 1000);
 // await t.expect(Selector("#session_username").innerText).eql("user");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
});

test("correct credentials expiring no refresh token", async t => {
  await t
    .typeText("#username", "user_no_refresh_token")
    .typeText("#password", "secret")
    .click("button");
  await t.expect(Selector("#session_username").innerText).eql("user_no_refresh_token");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
  await t.wait(16 * 1000);
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
});

test("correct credentials delayed response", async t => {
  await t
    .typeText("#username", "userSlowLogin")
    .typeText("#password", "secret")
    .click("button");
  await t.expect(Selector("#session_username").innerText).eql("userSlowLogin");
  await t.expect(Selector("#session_validity").innerText).eql("valid");
  await t.expect(Selector("#session_entitlements").innerText).eql("a,b,c");
});

test("wrong credentials", async t => {
  await t
    .typeText("#username", "user")
    .typeText("#password", "wrong")
    .click("button");
  //await t.expect(Selector("#session_username").innerText).eql("user");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
  await t.expect(Selector("#message").innerText).contains("Unauthorized");
});

test("unknown user", async t => {
  await t
    .typeText("#username", "someone")
    .typeText("#password", "something")
    .click("button");
  //await t.expect(Selector("#session_username").innerText).eql("someone");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
  await t.expect(Selector("#message").innerText).contains("Unauthorized");
});

test("server error 502 html", async t => {
  await t
    .typeText("#username", "error 502 html")
    .typeText("#password", "something")
    .click("button");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
  await t.expect(Selector("#message").innerText).contains("#HT Bad Gateway");
});

test("server error 502 text", async t => {
  await t
    .typeText("#username", "error 502 text")
    .typeText("#password", "something")
    .click("button");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
  await t.expect(Selector("#message").innerText).contains("Bad Gateway");
});

/*
test("server error 0 json", async t => {
  await t
    .typeText("#username", "error 0 json")
    .typeText("#password", "something")
    .click("button");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
});
*/

test("server error WWW-Authenticate", async t => {
  await t
    .typeText("#username", "error 500 WWW-Authenticate")
    .typeText("#password", "something")
    .click("button");
  await t.expect(Selector("#session_validity").innerText).eql("invalid");
  await t.expect(Selector("#session_entitlements").innerText).eql("");
  await t.expect(Selector("#message").innerText).contains("Internal Server Error");
});
