import { Guard } from "./guard.mjs";

/**
 * Shows a component during transition.
 * @param {SvelteComponent} component to show up during th transition
 * @param {number} rampUpTime initial delay for the componnt to show up
 */
export class WaitingGuard extends Guard {
  
  #component;
  #rampUpTime;
  
  constructor(component, rampUpTime = 300) {
    super();
    this.#component = component;
    this.#rampUpTime = rampUpTime;
  }

  async enter(transition) {
    transition.timeoutID = setTimeout(() => {
      transition.timeoutID = undefined;
      transition.component = this.#component;
    }, this.#rampUpTime);
  }

  async leave(transition) {
    if (transition.timeoutID) {
      clearTimeout(transition.timeoutID);
    }
  }
}
