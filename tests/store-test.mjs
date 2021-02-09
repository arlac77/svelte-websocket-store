import test from "ava";
import { connection } from "./helpers/server.mjs";
import WebSocket from "ws";

import websocketStore from "svelte-websocket-store";

globalThis.WebSocket = WebSocket;
const port = 5002;

test("subscription opens connection", async t => {
  const wss = new WebSocket.Server({ port });

  const store = websocketStore(`ws://localhost:${port}`, "T1");

  let clientReceived;
  store.subscribe(value => clientReceived = value);

  const ws = await connection(wss);

  t.truthy(ws);
});
