import test from "ava";
import { connection, wait } from "./helpers/util.mjs";
import { WebSocketServer, WebSocket } from "ws";
import websocketStore from "svelte-websocket-store";

globalThis.WebSocket = WebSocket;

let port = 5002;

test.beforeEach(async t => {
  port++;
  t.context.port = port;
  t.context.wss = new WebSocketServer({ port });
});

test.afterEach(t => {
  t.context.wss.close();
  delete t.context.wss;
});

test("subscription open close", async t => {
  const store = websocketStore(`ws://localhost:${t.context.port}`);

  let clientReceived;
  const unsubscribe = store.subscribe(value => (clientReceived = value));

  const ws = await connection(t.context.wss);
  t.truthy(ws);

  await wait(50);

  let closeCalled = false;
  ws.on("close", () => (closeCalled = true));

  unsubscribe();

  await wait(50);

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
  ws.on("message", message => (serverReceived = JSON.parse(message)));

  ws.send(JSON.stringify("TO_CLIENT_1"));
  store.set("FROM_CLIENT_1");

  await wait(50);

  t.is(clientReceived, "TO_CLIENT_1");
  t.is(serverReceived, "FROM_CLIENT_1");
});

test("several subscriptions", async t => {
  const store = websocketStore(`ws://localhost:${t.context.port}`, "INITIAL");

  const subscriptions = [{}, {}, {}].map(s => {
    s.unsubscribe = store.subscribe(value => (s.value = value));
    return s;
  });

  const ws = await connection(t.context.wss);
  t.truthy(ws);

  await wait(50);

  let closeCalled = false;
  ws.on("close", () => (closeCalled = true));

  subscriptions.map(s => s.unsubscribe());

  await wait(50);

  t.true(closeCalled);
});

test.skip("failing subscription", async t => {
  try {
    const store = websocketStore("ws://localhost:9999", "INITIAL");
    const unsubscribe = store.subscribe(value => {});

    store.set("FROM_CLIENT_1");

    await wait(100);

    t.true(false);
  } catch (e) {}

  t.true(true);
});

test("should not open a new ws connection if already existing", async t => {
  let counter = 0;
  t.context.wss.on("connection", () => {
    counter += 1;
  });

  const store = websocketStore(`ws://localhost:${t.context.port}`, "INITIAL");

  const subscription1 = store.subscribe(value => {});
  await wait(300);
  const subscription2 = store.subscribe(value => {});
  await wait(50);

  subscription1();
  subscription2();

  t.is(counter, 1, "number of connections opened");
});
