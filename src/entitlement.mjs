/**
 * @param {string|Object} data
 */
export class Entitlement {
  constructor(data) {
    if (typeof data === "string") {
      Object.defineProperties(this, { name: { value: data } });
    } else {
      Object.assign(this, data);
    }

    this.id = this.name;
  }

  get name() {
    return Array.isArray(this.cn) ? this.cn[0] : this.cn;
  }

  get displayName() {
    return this.name;
  }
}
