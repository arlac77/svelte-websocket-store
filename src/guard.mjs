/**
 * Enforces conditions of routes
 * Like the presents of values in the context
 */
export class Guard {
  /**
   * Called while entering a route (current outlet is not yet set)
   * @param {Transition} transition
   */
  async enter(transition) {}

  /**
   * Called before leaving a route
   * @param {Transition} transition
   */
  async leave(transition) {}

  toString() {
    return this.constructor.name;
  }
}

/**
 * Redirects to a given path if condition is met.
 *
 * @param {string} path
 * @param {Function} condition redirects when returning true
 */
export function redirectGuard(path, condition) {
  return {
    toString: () => `redirect(${path})`,
    enter: async transition => {
      if (condition === undefined || condition(transition)) {
        return transition.redirect(path);
      }
    },
    leave: () => {}
  };
}

/**
 * Execute guards in a sequence.
 * @param {Iterable<Guard>} children
 */
export function sequenceGuard(children) {
  return {
    toString: () => children.toString(),
    enter: async transition => {
      for (const child of children) {
        await child.enter(transition);
      }
    },
    leave: async transition => {
      for (const child of children) {
        await child.leave(transition);
      }
    }
  };
}

/**
 * Execute guards in a parallel.
 * @param {Iterable<Guard>} children
 */
export function parallelGuard(children) {
  return {
    enter: async transition =>
      Promise.all([...children].map(c => c.enter(transition))),
    leave: async transition =>
      Promise.all([...children].map(c => c.leave(transition)))
  };
}
