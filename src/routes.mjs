import { sequenceGuard } from "./guard.mjs";

const dummyFunction = () => {};
const dummySet = { size: 0, forEach: dummyFunction };

/**
 * Default empty guard does nothing.
 */
const nullGuard = {
  toString: () => "",
  enter: dummyFunction,
  leave: dummyFunction
};

function valueAtPath(obj, str) {
  for (const part of str.split(".")) {
    obj = obj[part];
    if (obj === undefined) {
      return;
    }
  }
  if (obj !== undefined) {
    return obj.toString();
  }
}

/**
 * Route at the root of the tree.
 * This route has no parent.
 * All other routes are below of this one.
 */
class RootRoute {
  /**
   * Are there parameters in the path.
   * @return {boolean} true if route has parameters (:key)
   */
  get hasParams() {
    return this.keys.length > 0;
  }

  /**
   * @return {string} empty as we are the root
   */
  get path() {
    return "";
  }

  get objectInstance() {
    return Object;
  }

  /**
   * @return {Object} empty object
   */
  get propertyMapping() {
    return {};
  }

  /**
   * @return {Guard} empty guard which does nothing
   */
  get guard() {
    return nullGuard;
  }

  enter() {}
  leave() {}
  propertiesFor() {}
  valueFor() {}
  async *iteratorFor() {}

  pathFor(value, suffix = "") {
    const properties = this.propertiesFor(value);
    return properties && this.path.replace(/:(\w+)/g, (m, name) => properties[name]) + suffix;
  }
}

const rootRoute = new RootRoute();

/**
 * Route
 * Subscriptions on Routes fire when the route value changes.
 * @property {string} path full path of the Route including all parents
 * @property {SvelteComponent} component target to show
 * @property {SvelteComponent} linkComponent content for {@link ObjectLink}
 * @property {Object} propertyMapping Map properties to object attributes
 *           Keys are the property names and values are the keys in the resulting object.
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 * @property {any} value
 */
export class SkeletonRoute extends RootRoute {

  subscriptions = dummySet;
  parent = rootRoute;

  constructor(path, options = {}) {
    super();

    for (const n of ["path", "href", "factory", "$$slots", "$$scope"]) {
      delete options[n];
    }

    if (Array.isArray(options.guard)) {
      switch (options.guard.length) {
        case 0:
          delete options.guard;
          break;
        case 1:
          options.guard = options.guard[0];
          break;
        default:
          options.guard = sequenceGuard(options.guard);
      }
    }

    let value;

    Object.defineProperties(this, {
      path: { get: () => this.parent.path + path },
      value: {
        set: v => {
          value = v;
          this.emit();
        },
        get: () => value
      },
      ...Object.fromEntries(
        Object.entries(options)
          .filter(([k, v]) => v !== undefined)
          .map(([k, v]) => [k, { value: v }])
      )
    });
  }

  emit() {
    this.subscriptions.forEach(subscription => subscription(this));
  }

  /**
   * Enter the route from a former one.
   * All parent routes up to the common ancestor are entered first.
   * @param {Transition} transition
   * @param {Route} untilRoute the common ancestor with the former route
   */
  async enter(transition, untilRoute) {
    if (this !== untilRoute) {
      await this.parent.enter(transition, untilRoute);
      return this.guard.enter(transition);
    }
  }

  /**
   * Leave the route to a new one.
   * All parent routes up to the common ancestor are left.
   * @param {Transition} transition
   * @param {Route} untilRoute the common ancestor with the future route
   */
  async leave(transition, untilRoute) {
    if (this !== untilRoute) {
      await this.guard.leave(transition);
      return this.parent.leave(transition, untilRoute);
    }
  }

  /**
   * Check if value and properties are acceptable for the route.
   * @param {any} value to be placed into route
   * @param {Object} properties as presented in the route
   * @return {boolean} true if value can be accepted
   */
  isAcceptable(value, properties) {
    if (value instanceof this.objectInstance) {
      for (const [key, propertyPath] of Object.entries(this.propertyMapping)) {
        if (valueAtPath(value, propertyPath) !== properties[key]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Extract properties from a value.
   * All property values must be strings.
   * @param {any} value source of the properties
   * @return {Object|undefined} properties extracted from given value
   */
  propertiesFor(value) {
    let properties = this.parent.propertiesFor(value);

    if (value instanceof this.objectInstance) {
      for (const [key, propertyPath] of Object.entries(this.propertyMapping)) {
        const v = valueAtPath(value, propertyPath);
        if (v === undefined) {
          return;
        }
        if (properties === undefined) {
          properties = {};
        }
        properties[key] = v.toString();
      }
    }

    return properties;
  }

  /**
   * Find common ancestor with an other Route.
   * @param {Route} other
   * @return {Route|undefined} common ancestor Route between receiver and other
   */
  commonAncestor(other) {
    for (let o = other; o; o = o.parent) {
      for (let p = this; p; p = p.parent) {
        if (p === o) {
          return p;
        }
      }
    }
  }

  subscribe(subscription) {
    if (this.subscriptions === dummySet) {
      this.subscriptions = new Set();
    }
    this.subscriptions.add(subscription);
    subscription(this);
    return () => this.subscriptions.delete(subscription);
  }

  /**
   * Deliver value for a given set of properties of the transition.
   * Default implemantation asks the parent route.
   * @param {Transition} transition
   * @return {any} for matching properties
   */
  valueFor(transition) {
    return this.parent.valueFor(transition);
  }

  /**
   * Deliver route value.
   * Default implemantation asks the parent route.
   * @return {any}
   */
  get value() {
    return this.parent.value;
  }

  async *iteratorFor(transition) {
    yield* this.parent.iteratorFor(transition);
  }

  /**
   * Deliver property mapping.
   * Default implemantation asks the parent route.
   * @return {Object} for matching properties
   */
  get propertyMapping() {
    return this.parent.propertyMapping;
  }

  /**
   * Default implemantation asks the parent route.
   */
  get objectInstance() {
    return this.parent.objectInstance;
  }
}

/**
 * Route holding a single value
 */
export class ValueStoreRoute extends SkeletonRoute {
  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);
    this.value = await this.valueFor(transition);
  }
}
