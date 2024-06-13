<script>
  import { dispatchNavigationEvent } from "../util.mjs";

  export let href;
</script>

<a {href} onclick={dispatchNavigationEvent}>
  <slot />
</a>
