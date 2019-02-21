export default class Store {
  constructor(id, synapse) {
    if (!id) throw new Error('Store requires an id');
    if (!synapse) throw new Error('Store requires a synapse instance');

    this.id = id;
    this.synapse = synapse;
    this.state = {};
  }

  setState(updater, { log = true } = {}) {
    let updates =
      typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...updates };
    this.synapse.updateState(this.id, this.state, { log });
  }
}
