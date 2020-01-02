<script>
  import { websocketStore } from "../../src/index.mjs";

  export const socket1 = websocketStore('ws://localhost:5001');
  export const socket2 = websocketStore('ws://localhost:5001');
</script>

<input id="input1" bind:value={$socket1} placeholder="publish value">

<input id="input2" bind:value={$socket2} placeholder="back from server">
