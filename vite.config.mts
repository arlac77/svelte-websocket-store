import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { extractFromPackage } from "npm-pkgbuild";
import { WebSocketServer, WebSocket } from "ws";

const wsPort = 5001;

export default defineConfig(async ({ command, mode }) => {
  const res = extractFromPackage(
    {
      dir: new URL("./", import.meta.url).pathname,
      mode
    },
    process.env
  );
  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = properties["http.path"];
  const production = mode === "production";

  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  if(!production) {
    MyWebSocketServer();
  }

  return {
    base,
    root: "tests/app/src",
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        }
      })
    ],
    server: { host: true },
    build: {
      outDir: "../../../build",
      target: "esnext",
      emptyOutDir: true,
      minify: production,
      sourcemap: true
    }
  };
});

function MyWebSocketServer() {
  const wss = new WebSocketServer({ port: wsPort });

  let timer;

  let n = 0;

  wss.on("connection", ws => {
    ws.on("message", message => {
      message = message.toString();
      try {
        const m = message.match(/(\w+)\((\w+)\)/);
        if (m) {
          switch (m[1]) {
            case "disconnect":
              {
                wss.close();
                console.log(`close and reopen after ${parseInt(m[2])}ms`);
                setTimeout(
                  () => MyWebSocketServer(),
                  parseInt(m[2])
                );
              }
              break;
            case "timer": {
              if (timer) {
                clearInterval(timer);
              }

              if (m[2] === "on") {
                timer = setInterval(() => {
                  n++;
                  wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                      client.send(JSON.stringify(`timer ${n}`));
                    }
                  });
                }, 1000);
              }
            }
          }

          return;
        }

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(">" + JSON.parse(message)));
          }
        });
      } catch (e) {
        console.log(e);
      }
    });

    ws.send(JSON.stringify("x"));
  });
}
