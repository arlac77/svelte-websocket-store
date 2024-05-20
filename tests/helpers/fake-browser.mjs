if (!globalThis.window) {
  const base = "https://example.org/";
  const listeners = { popstate: [], routeLink: [] };

  const window = {
    addEventListener(slot, fn) {
      listeners[slot].push(fn);
    },

    location: new URL(base)
  };

  globalThis.window = window;

  let cs = 0;
  const states = [{ state: undefined, url: base }];

  const history = {
    async back() {
      if (cs > 0) {
        cs = cs - 1;
        window.location = states[cs].url;
      }
    },
    async forward() {
      if (cs < states.length - 1) {
        cs = cs + 1;
        window.location = states[cs].url;
      }
    },
    async go(off) {
      if (cs + off < 0 || cs + off > states.length - 1) {
        return;
      }

      cs += off;
      window.location = states[cs].url;
    },

    get state() {
      return states[state.length - 2];
    },
    get length() {
      return states.length;
    },

    replaceState(state, unused, url) {
      url = new URL(url, base);
      states[cs] = { state, url };
      window.location = url;
    },
    pushState(state, unused, url) {
      url = new URL(url, base);
      cs += 1;
      states.push({ state, url });
      window.location = url;
    }
  };

  globalThis.history = history;
}
