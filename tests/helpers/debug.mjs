import { setupRoutes } from "./setup.mjs";

async function doit() {
  const { leaf } = setupRoutes();

  let leafValue;

  leaf.subscribe(x => (leafValue = x));

  const transition = {
    path: "/master/2/d",
    router: { params: { detail: "2", leaf: "d" } }
  };

  await leaf.enter(transition);

  console.log(leafValue);
}

doit();
