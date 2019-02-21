export default class Store {
  constructor(id, vault) {
    if (!id) throw new Error('Store requires an id');
    if (!vault) throw new Error('Store requires a vault instance');

    this.id = id;
    this.vault = vault;
    this.state = {};
  }

  setState(updater, { log = true } = {}) {
    return Promise.resolve().then(() => {
      let updates =
        typeof updater === 'function' ? updater(this.state) : updater;
      this.state = { ...this.state, ...updates };
      this.vault.updateState(this.id, this.state, { log });
    });
  }
}
