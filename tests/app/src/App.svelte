<script>
  import { websocketStore } from "../../../src/index.mjs";

  export const socket1 = websocketStore('ws://localhost:5001');
  export const socket2 = websocketStore('ws://localhost:5001');

  let isTimerRunning = false;

  function timer()
  {
    $socket1 = isTimerRunning ? "timer(off)" : "timer(on)";
    isTimerRunning = !isTimerRunning;
  }

  function disconnect()
  {
    $socket1 = "disconnect(2000)";
  }

</script>

<input id="input1" bind:value={$socket1} placeholder="publish value">
<input id="input2" bind:value={$socket2} placeholder="back from server">

<button on:click={timer}>Server Timer {isTimerRunning ? 'Off' : 'On'}</button>
<button on:click={disconnect}>Server Disconnect</button>