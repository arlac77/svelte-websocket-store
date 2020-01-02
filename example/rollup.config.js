import dev from "rollup-plugin-dev";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import WebSocket from "ws";

const port = 5000;
const wsPort = 5001;

export default {
  input: "example/src/index.mjs",
  output: {
    sourcemap: true,
    format: "esm",
    file: `example/public/bundle.mjs`
  },
  plugins: [
    dev({
      port,
      dirs: ["example/public"],
      spa: "example/public/index.html",
      basePath: "/base",
      extend(app, modules) {
        const wss = new WebSocket.Server({ port: wsPort });
        wss.on("connection", ws => {
          ws.on("message", message => {
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(">" + JSON.parse(message) ));
              }
            });
          });

          ws.send(JSON.stringify('x'));
        });
      }
    }),
    resolve({ browser: true }),
    svelte()
  ]
};
