<script>
  import { websocketStore } from "../../src/index.mjs";

  export const socket1 = websocketStore('wss://echo.websocket.org');
  //export const socket2 = websocketStore('wss://echo.websocket.org');

</script>

<input bind:value={$socket1} placeholder="publish value">

<input bind:value={$socket1} placeholder="back from server">
