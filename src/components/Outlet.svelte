<script>
  import { getContext } from "svelte";
  import { ROUTER } from "../util.mjs";
  const router = getContext(ROUTER);
</script>

<svelte:component this={$router.component} {router}/>
