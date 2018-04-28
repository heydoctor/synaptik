export default class Store {
  constructor(id, vault, opts = {}) {
    this.id = id;
    this.vault = vault;
    this.logStateChanges = opts.logStateChanges || true;
  }

  setState(updater, cb, { hideStateChanges = false } = {}) {
    let stateUpdates;

    if (typeof updater === 'function') {
      stateUpdates = updater(this.state);
    } else {
      stateUpdates = updater;
    }

    const nextState = Object.assign({}, this.state, stateUpdates);

    if (!hideStateChanges && this.debugMode && this.logStateChanges) {
      this.logStateChange(this.state, nextState);
    }

    this.state = nextState;
    this.vault.updateState(this.id, this.state);

    if (typeof cb === 'function') cb(this.state);
  }
}
