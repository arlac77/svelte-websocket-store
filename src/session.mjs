import { JSONContentTypeHeader } from "./constants.mjs";

/**
 * Data as preserved in the backing store.
 * @typedef {Object} SessionData
 * @property {string} username user name (id)
 * @property {string} access_token JWT token
 * @property {string} refresh_token JWT token
 */
const storeKeys = ["username", "refresh_token", "access_token"];

/**
 * Time required to execute a refresh
 */
const msecsRequiredForRefresh = 2000;

function copy(destination, source) {
  for (const key of storeKeys) {
    if (source === undefined || source[key] === undefined) {
      destination[key] = undefined;
    } else {
      destination[key] = source[key];
    }
  }
}

/**
 *
 */
const supportedTokenTypes = {
  bearer: {}
};

/**
 * User session.
 * To create as session backed by browser local storage.
 * ```js
 * let session = new Session(localStorage);
 * ```
 * or by browser session storage
 * ```js
 * let session = new Session(sessionStorage);
 * ```
 * @param {SessionData} store
 * @property {Set<string>} entitlements
 * @property {Set<Object>} subscriptions store subscriptions
 * @property {Date} expirationDate when the access token expires
 * @property {string} access_token token itself
 * @property {string} refresh_token refresh token
 */
export class Session {
  subscriptions = new Set();
  entitlements = new Set();
  expirationDate = new Date(0);

  access_token;
  refresh_token;

  constructor(store = localStorage) {
    let expirationTimer;

    Object.defineProperties(this, {
      expirationTimer: {
        get: () => expirationTimer,
        set: v => (expirationTimer = v)
      },
      ...Object.fromEntries(
        storeKeys.map(key => [
          key,
          {
            get: () => store[key],
            set: v => {
              if (v !== store[key]) {
                if (v === undefined) {
                  delete store[key];
                } else {
                  store[key] = v;
                }
                if (key === "access_token") {
                  this.subscriptions.forEach(subscription =>
                    subscription(this)
                  );
                }
              }
            }
          }
        ])
      )
    });

    this.update(store);
  }

  /**
   * Consume auth response data and reflect internal state.
   * @param {Object} data
   */
  update(data) {
    if (data !== undefined) {
      if (data.endpoint) {
        this.endpoint = data.endpoint;
      }

      if (supportedTokenTypes[data.token_type?.toLowerCase()]) {
        const decoded = decode(data.access_token);

        if (decoded) {
          this.expirationDate.setTime(
            data.expires_in
              ? Date.now() + parseInt(data.expires_in) * 1000
              : decoded.exp * 1000
          );

          const expiresInMilliSeconds =
            this.expirationDate.valueOf() - Date.now();

          if (expiresInMilliSeconds > 0) {
            if (decoded.entitlements) {
              decoded.entitlements
                .split(/,/)
                .forEach(e => this.entitlements.add(e));
            }

            this.expirationTimer = setTimeout(async () => {
              if (!(await this.refresh())) {
                this.invalidate();
              }
            }, expiresInMilliSeconds - msecsRequiredForRefresh);

            copy(this, data);
            return;
          }
        }
      }
    }
    this.invalidate();
  }

  /**
   * Refresh with refresh_token.
   * @return {Promise<boolean>} true if refresh was succcessfull false otherwise
   */
  async refresh() {
    if (this.refresh_token) {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: JSONContentTypeHeader,
        body: JSON.stringify({
          refresh_token: this.refresh_token,
          grant_type: "refresh_token"
        })
      });
      if (response.ok) {
        this.update(await response.json());
        return true;
      }
    }

    return false;
  }

  /**
   * Http header suitable for fetch.
   * @return {Object} header The http header.
   * @return {string} header.Authorization The Bearer access token.
   */
  get authorizationHeader() {
    return this.isValid ? { Authorization: "Bearer " + this.access_token } : {};
  }

  /**
   * As long as the expirationTimer is running we must be valid.
   * @return {boolean} true if session is valid (not expired)
   */
  get isValid() {
    return this.expirationTimer !== undefined;
  }

  /**
   * Remove all tokens from the session and the backing store.
   */
  invalidate() {
    this.expirationDate.setTime(0);
    this.entitlements.clear();

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = undefined;
    }

    copy(this);
  }

  /**
   * Check presence of an entitlement.
   * @param {string} name of the entitlement
   * @return {boolean} true if the named entitlement is present
   */
  hasEntitlement(name) {
    return this.entitlements.has(name);
  }

  /**
   * Fired when the session changes.
   * @param {Function} subscription
   */
  subscribe(subscription) {
    subscription(this);
    this.subscriptions.add(subscription);
    return () => this.subscriptions.delete(subscription);
  }
}

/**
 * Extract and decode the payload.
 * @param {string} token
 * @return {Object} payload object
 */
function decode(token) {
  if (token === undefined) {
    return undefined;
  }

  const payload = token.split(".")[1];

  return payload && JSON.parse(atob(payload));
}
