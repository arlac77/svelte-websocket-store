import { matcher } from "multi-path-matcher";
import { BaseTransition } from "./base-transition.mjs";

/**
 * Transition between routes.
 * @param {Router} router
 * @param {string} path new destination
 * @property {Router} router
 * @property {string} path new destination
 */
export class Transition extends BaseTransition {
  constructor(router, path) {
    super();

    let component;

    Object.defineProperties(this, {
      router: { value: router },
      path: { value: path },
      component: {
        get: () => (this.nested === undefined ? component : undefined),
        set: value => {
          component = value;
          this.router.emit();
        }
      }
    });

    Object.assign(this, matcher(router.routes, path));
  }

  /**
   * Start the transition
   * - leave old route
   * - find matching target route @see matcher()
   * - enter new route
   * - set params
   * - set current route
   */
  async start() {
    try {
      if (this.route) {
        const old = this.router.route;
        const ancestor = this.route.commonAncestor(old);

        if (old !== undefined) {
          await old.leave(this, ancestor);
        }

        await this.route.enter(this, ancestor);
        this.router.state = this;
      }
    } catch (e) {
      await this.abort(e);
    } finally {
      this.end();
    }
  }

  /**
   * Cleanup transition.
   * Update Nodes active state
   * @see Router.finalizePush
   */
  end() {
    if (this.nested === undefined) {
      this.router.finalizePush(this.path);
    }
  }

  /**
   * Halt current transition and go to another route.
   * To proceed with the original route call {@link continue()}
   * The original transition will keept in place and can be continued afterwards.
   * @param {string} path new route to enter temporary
   */
  async redirect(path) {
    this.nested = { state: this.router.replace(path) };

    return new Promise((resolve, reject) => {
      this.nested.continue = async () => {
        try {
          this.router.state = this.nested.state;
          resolve();
        } catch (e) {
          await this.abort(e);
          reject(e);
        } finally {
          this.nested = undefined;
        }
      };

      this.nested.abort = () => {
        this.nested = undefined;
        reject();
      };
    });
  }

  /**
   * Bring back the router into the state before the transition has started.
   * All nested transitions also will be termniated.
   * @param {Exception|undefined} e
   */
  async abort(e) {
    await super.abort(e);

    history.back();
    setTimeout(() => this.router.finalizePush(), 0);
  }
}
