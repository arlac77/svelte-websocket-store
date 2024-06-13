import { SkeletonRoute } from "./routes.mjs";

/**
 * Route holding a ordered collection of values.
 * 
 * @property {any[]} value
 */
export class MasterRoute extends SkeletonRoute {
  constructor(path, options) {
    super(path, options);
    this.value = [];
  }

  propertiesFor(value)
  {
  }

  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);

    const values = [];

    for await (const value of await this.iteratorFor(transition)) {
      values.push(value);
    }

    this.value = values;
  }
}
