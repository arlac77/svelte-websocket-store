const reopenTimeouts = [2000, 5000, 10000, 30000, 60000];

/**
 * Create a writable store based on a web-socket.
 * Data is transferred as JSON.
 * Keeps socket open (reopens if closed) as long as there are subscriptions.
 * @param {string} url the WebSocket url
 * @param {any} initialValue store value used before 1st. response from server is present
 * @param {string[]} socketOptions transparently passed to the WebSocket constructor
 * @return {Store}
 */
export function websocketStore(url, initialValue, socketOptions) {
  let socket, openPromise, reopenTimeoutHandler;
  let reopenCount = 0;
  const subscriptions = new Set();

  function reopenTimeout() {
    const n = reopenCount;
    reopenCount++;
    return reopenTimeouts[
      n >= reopenTimeouts.length - 1 ? reopenTimeouts.length - 1 : n
    ];
  }

  function close() {
    if (reopenTimeoutHandler) {
      clearTimeout(reopenTimeoutHandler);
    }

    if (socket) {
      socket.close();
      socket = undefined;
    }
  }

  function reopen() {
    close();
    if (subscriptions.size > 0) {
      reopenTimeoutHandler = setTimeout(() => open(), reopenTimeout());
    }
  }

  async function open() {
    if (reopenTimeoutHandler) {
      clearTimeout(reopenTimeoutHandler);
      reopenTimeoutHandler = undefined;
    }

    // we are still in the opening phase
    if (openPromise) {
      return openPromise;
    }
    if (socket) {
      return
    }

    socket = new WebSocket(url, socketOptions);

    socket.onmessage = event => {
      initialValue = JSON.parse(event.data);
      subscriptions.forEach(subscription => subscription(initialValue));
    };

    socket.onclose = event => reopen();

    openPromise = new Promise((resolve, reject) => {
      socket.onerror = error => {
        reject(error);
        openPromise = undefined;
      };
      socket.onopen = event => {
        reopenCount = 0;
        resolve();
        openPromise = undefined;
      };
    });
    return openPromise;
  }

  return {
    set(value) {
      const send = () => socket.send(JSON.stringify(value));
      if (socket.readyState !== WebSocket.OPEN) open().then(send);
      else send();
    },
    subscribe(subscription) {
      open();
      subscription(initialValue);
      subscriptions.add(subscription);
      return () => {
        subscriptions.delete(subscription);
        if (subscriptions.size === 0) {
          close();
        }
      };
    }
  };
}

export default websocketStore;