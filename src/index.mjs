
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

    socket.onclose = event => {
      close();
      if(subscriptions.size > 0) {
        open();
      }
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
        if(subscriptions.size === 0) {
          close();
        }
      }
    }
  };
}
