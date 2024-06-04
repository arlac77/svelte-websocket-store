<script>
  import { setContext, onMount } from "svelte";
  import { ROUTER } from "../util.mjs";
  import { BaseRouter } from "../base-router.mjs";

  export let base;

  const router = new BaseRouter([], base);

  setContext(ROUTER, router);

  onMount(() => router.push(router.path));
</script>

<slot />
