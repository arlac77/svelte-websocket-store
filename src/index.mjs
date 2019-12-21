export function websocketStore(url, ...args) {
  let socket;
  const subscriptions = new Set();
  let reopenTimeoutHandler;

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
      reopenTimeoutHandler = setTimeout(() => open(), 5000);
    }
  }

  function open() {
    if (reopenTimeoutHandler) {
      clearTimeout(reopenTimeoutHandler);
      reopenTimeoutHandler = undefined;
    }

    if (socket) {
      return;
    }

    socket = new WebSocket(url, ...args);

    socket.onclose = event => reopen();

    socket.onmessage = event =>
      subscriptions.forEach(subscription => subscription(event.data));
  }

  return {
    set(value) {
      open();
      socket.send(value);
    },
    subscribe(subscription) {
      open();
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
