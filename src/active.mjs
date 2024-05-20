/**
 * Keeps the node active state in sync.
 * @see {Router.updateActive}
 * @param {Element} node
 * @param {Router} router
 */
export function active(node, router) {
  router.linkNodes.add(node);
  router.updateActive(node);

  return {
    destroy() {
      router.linkNodes.delete(node);
    }
  };
}
