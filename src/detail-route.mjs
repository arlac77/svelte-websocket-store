import { ValueStoreRoute } from "./routes.mjs";

/**
 * Route to represent a slice of the masters list of values.
 *
 * @property {Route} master route holding the master records
 */
export class DetailRoute extends ValueStoreRoute {
  /**
   * Route holding the list ov values
   * @return {Route} our master
   */
  get master() {
    return this.parent;
  }

  /**
   * @return {Promise<any>} 1st. entry
   */
  async first() {
    return this.master.value[0];
  }

  /**
   * @return {any} last entry
   */
  async last() {
    return this.master.value[this.master.value.length - 1];
  }

  /**
   * @return {any} previous value
   */
  async previous() {
    const i = this.master.value.indexOf(this.value);
    if (i > 0) {
      return this.master.value[i - 1];
    }
  }

  /**
   * @return {Promise<any>} next value
   */
  async next() {
    const i = this.master.value.indexOf(this.value);
    if (i >= 0) {
      return this.master.value[i + 1];
    }
  }

  async valueFor(transition) {
    for await (const value of this.master.iteratorFor(transition)) {
      if (this.isAcceptable(value, transition.params)) {
        return value;
      }
    }
  }
}
