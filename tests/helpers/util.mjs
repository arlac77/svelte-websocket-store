/**
 * Wait for connection.
 * @param {WebSocketServer} wss
 */
export async function connection(wss) {
  return new Promise((resolve, reject) => {
    wss.on("connection", ws => resolve(ws));
    wss.on("error", error => reject(error));
  });
}

export async function wait(msecs = 1000) {
  return new Promise((resolve, reject) => setTimeout(resolve, msecs));
}
