import { Synapse } from './Synapse';

type Updater<State extends object> = Partial<State> | ((state: State) => Partial<State>);

type RunAsync<T, S> = {
  key?: keyof S;
  work: () => T | Promise<T>;
  log?: boolean;
};

export class Store<S extends { state: object }, Stores extends Readonly<Stores>> {
  stores = {} as Synapse<Stores>['stores'];
  state = {} as S['state'];

  private id: keyof Stores;
  synapse: Synapse<Stores>;

  constructor(id: keyof Stores, synapse: Synapse<Stores>) {
    if (!id) throw new Error('Store requires an id');
    if (!synapse) throw new Error('Store requires a synapse instance');

    this.id = id;
    this.synapse = synapse;
    this.stores = synapse.stores;
    this.state = {};
  }

  setState(updater: Updater<S['state']>, { log = true } = {}) {
    const updates: Partial<S['state']> =
      typeof updater === 'function' ? updater(this.state) : updater;

    this.state = { ...this.state, ...updates };
    // @ts-ignore
    this.synapse.updateState(this.id, this.state, { log });
  }

  async runAsync<T>({ key, work, log = true }: RunAsync<T, S['state']>) {
    const errorKey = `${key}Error`;
    const storeKey = key || 'loading';

    this.setState({ [storeKey]: true, [errorKey]: null } as S['state'], { log });

    try {
      const res = await work();
      this.setState({ [storeKey]: false } as S['state'], { log });
      return res;
    } catch (error) {
      this.setState({ [storeKey]: false, [errorKey]: error } as S['state'], { log });
      throw error;
    }
  }
}
