<script>
  import { dispatchNavigationEvent } from "../util.mjs";

  export let href;
</script>

<a {href} on:click={dispatchNavigationEvent}>
  <slot />
</a>
