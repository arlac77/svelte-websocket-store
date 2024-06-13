import { findClosestAttribute } from "./util.mjs";

export function link(node, router) {
  node.addEventListener("click", event => {
    event.preventDefault();
    router.push(findClosestAttribute(event.target, "href"));
  });
}
