import { Selector, ClientFunction } from "testcafe";
import { articles } from "../app/src/data.mjs";
import { base, login } from "./helpers/util.mjs";

const getLocation = ClientFunction(() => window.location.href);
const goBack = ClientFunction(() => window.history.back());

const al = id => {
  return {
    path: `/article/${id}#price`,
    title: `Article ${articles[id].name}`
  };
};

const links = [
  { path: "/about", title: "About" },
  // { path: "/index.html", redirect:"/", title: "Home" },
  { path: "/article", title: "Articles" },
  //  al("01"),
  //  { path: "/article", title: "Articles" },
  al("02"),
  { path: "/about", title: "About" },
  { path: "/article", title: "Articles" },
  al("03"),
  { path: "/article", title: "Articles" },
  al("12")
];

fixture`Getting Started`.page`${base}`;

test("click arund", async t => {
  for (const l of links) {
    const a = Selector("a").withAttribute("href", l.path);

    await t.click(a);

    await login(t);

    const title = Selector(".routetitle");

    await t.wait(3500);

    await t.expect(title.innerText).contains(l.title);

    /*
    await t
      .expect(*/
    /* https://github.com/DevExpress/testcafe/issues/5449
      keep comment until fixed */
    /*   title.innerText
      )
      .contains(l.title);*/

    await t.expect(getLocation()).contains(l.path);
  }
});

test("routing failure", async t => {
  await t.click(Selector("a").withAttribute("href", "/about"));

  const title = Selector(".routetitle");
  const a = Selector("a").withAttribute("href", "/about");

  await t.click(a).expect(title.innerText).eql("About");
});

test.page`${base}about`("about", async t => {
  const title = Selector(".routetitle");
  await t.expect(title.innerText).eql("About");
});

test.page`${base}article/10#price`("article/10#price", async t => {
  const title = Selector(".routetitle");

  await login(t);

  //console.log(await t.getBrowserConsoleMessages());

  await t.expect(title.innerText).contains("Pizza Quattro Stagioni");
});

test("navigate around", async t => {
  const title = Selector(".routetitle");

  await t.navigateTo(`${base}about`).expect(title.innerText).eql("About");

  //console.log(await getLocation());

  await t.navigateTo(`${base}article`);

  //console.log(await getLocation());

  await login(t);

  await t.expect(title.innerText).eql("Articles");

  //console.log(await getLocation());

  await t.expect(getLocation()).contains("article");

  const a = Selector("a").withAttribute("href", "/article/18#price");
  await t.click(a);
  await t.expect(getLocation()).contains("article/18");
  await t.expect(title.innerText).contains("Pizza Prosciutto");

  //console.log(await getLocation());

  await goBack();

  //console.log(await getLocation());
  /* await t.expect(getLocation()).contains("article");
  await t.expect(title.innerText).eql("Articles");
  await t.expect(getLocation()).contains("about");
  await t.expect(title.innerText).eql("About");
*/
});
