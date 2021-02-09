import test from "ava";
import { connection, wait } from "./helpers/util.mjs";
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

test("subscription open close", async t => {
  const store = websocketStore(`ws://localhost:${t.context.port}`);

  let clientReceived;
  const unsubscribe = store.subscribe(value => (clientReceived = value));

  const ws = await connection(t.context.wss);
  t.truthy(ws);

  await wait(100);

  let closeCalled = false;
  ws.on("close",() => closeCalled = true );

  unsubscribe();

  await wait(100);

  t.true(closeCalled);
});

test("read write", async t => {
  const store = websocketStore(`ws://localhost:${t.context.port}`, "INITIAL");

  let clientReceived;
  store.subscribe(value => (clientReceived = value));
  t.is(clientReceived, "INITIAL");

  const ws = await connection(t.context.wss);

  t.truthy(ws);

  let serverReceived;
  ws.on("message", message => serverReceived = JSON.parse(message));

  ws.send(JSON.stringify("TO_CLIENT_1"));
  store.set("FROM_CLIENT_1");

  await wait(100);
  
  t.is(clientReceived, "TO_CLIENT_1");
  t.is(serverReceived, "FROM_CLIENT_1");
});
