<script>
  import { setContext, getContext } from "svelte";
  import { ROUTER, ROUTE } from "../util.mjs";
  import { link } from "../link.mjs";
  import { active } from "../active.mjs";
  import { SkeletonRoute } from "../routes.mjs";

  export let path;
  export let href = path;
  export let factory = SkeletonRoute;

  const route = new factory(path, {
    parent: getContext(ROUTE),
    ...$$props
  });

  setContext(ROUTE, route);

  const router = getContext(ROUTER);
  router.addRoute(route);
</script>

{#if route.hasParams}
  <slot />
{:else}
  <a {href} use:link={router} use:active={router}>
    <slot />
  </a>
{/if}
