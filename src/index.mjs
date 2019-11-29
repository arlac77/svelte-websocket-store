
export function websocketStore(url) {
  let socket;
  const subscriptions = new Set();

  function close() {
    if (socket) {
      socket.close();
      socket = undefined;  
    }
  }

  function open() {
    if (socket) {
      return;
    }

    socket = new WebSocket(url);

    socket.onopen = event => {
      console.log(event);
    };

    socket.onerror = event => {
      console.log(event);
    };

    socket.onmessage = event =>
      subscriptions.forEach(subscription => subscription(event.data));
  }

  return {
    subscribe(subscription) {
      open();
      subscriptions.add(subscription);
      return () => {
        subscriptions.delete(subscription);
        if(substribtions.size === 0) {
          close();
        }
      }
    }
  };
}
