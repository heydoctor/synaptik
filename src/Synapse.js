export default class Synapse {
  stores = {};
  state = {};
  subscriptions = {};
  counter = 0;

  constructor(stores, config = {}) {
    this.logger = config.logger;

    Object.keys(stores).forEach(id => {
      let Store = stores[id];
      let store = new Store(id, this, config.storeConfig);
      this.stores[id] = store;
      this.updateState(id, store.state, { log: false });
    });
  }

  getState() {
    return this.state;
  }

  updateState(storeId, state, { log = true } = {}) {
    let oldState = { ...this.state };
    this.state[storeId] = state;
    this.notify();

    if (log && this.logger) {
      this.logger(oldState, this.state);
    }
  }

  subscribe(fn) {
    let id = ++this.counter;
    this.subscriptions[id] = fn;

    return () => {
      delete this.subscriptions[id];
    };
  }

  notify() {
    Object.keys(this.subscriptions).forEach(id => {
      let fn = this.subscriptions[id];
      typeof fn === 'function' && fn(this.state);
    });
  }
}
