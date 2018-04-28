/* eslint-disable no-underscore-dangle, no-plusplus */

export default class Vault {
  __state = {};
  __subscriptions = {};
  __counter = 0;
  stores = {};

  constructor() {
    if (this.debugMode) {
      window.VAULT = this;
    }
  }

  getState() {
    return this.__state;
  }

  updateState(storeName, state) {
    this.__state[storeName] = state;
    this.notify();
  }

  subscribe(fn) {
    const id = ++this.__counter;
    this.__subscriptions[id] = fn;

    return () => {
      delete this.__subscriptions[id];
    };
  }

  notify() {
    Object.keys(this.__subscriptions).forEach(id => {
      const fn = this.__subscriptions[id];
      if (!fn) return;
      fn(this.state);
    });
  }
}
