import test from "ava";
import { connection, wait } from "./helpers/server.mjs";
import WebSocket from "ws";

import websocketStore from "svelte-websocket-store";

globalThis.WebSocket = WebSocket;

let port = 5002;

test.beforeEach(async t => {
  port++;
  t.context.port = port;
  t.context.wss = new WebSocket.Server({ port });
});

test.afterEach(t => t.context.wss.close());

test("subscription opens connection", async t => {
  const store = websocketStore(`ws://localhost:${t.context.port}`, "INITIAL");

  let clientReceived;
  store.subscribe(value => (clientReceived = value));
  t.deepEqual(clientReceived, "INITIAL");

  const ws = await connection(t.context.wss);

  t.truthy(ws);

  ws.send(JSON.stringify("TO_CLIENT_1"));
  await wait(300);
  t.is(clientReceived, "TO_CLIENT_1");
});
