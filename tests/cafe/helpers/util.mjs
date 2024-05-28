import { Selector } from "testcafe";

export const base =
  "http://localhost:5173/";

export async function login(t) {
  if (await Selector("#submit").exists) {
    await t
      .typeText("#username", "user", { replace: true })
      .typeText("#password", "secret", { replace: true })
      .click("#submit");
  }
}
