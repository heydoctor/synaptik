import { Synapse } from './Synapse';
import { Constructor, InstancesOf } from './Synapse';

type Updater<State extends object> = Partial<State> | ((state: State) => Partial<State>);

type RunAsync<T, S> = {
  key?: keyof S;
  work: () => T | Promise<T>;
  log?: boolean;
};

export class Store<IStore extends { state: object }, IStores extends Readonly<IStores>> {
  stores = {} as Synapse<IStores>['stores'];
  state = {} as IStore['state'];

  private id: keyof IStores;
  private synapse: Synapse<IStores>;

  constructor(id: keyof IStores, synapse: Synapse<IStores>) {
    if (!id) throw new Error('Store requires an id');
    if (!synapse) throw new Error('Store requires a synapse instance');

    this.id = id;
    this.synapse = synapse;
    this.stores = synapse.stores;
    this.state = {};
  }

  setState(updater: Updater<IStore['state'] | Record<string, any>>, { log = true } = {}) {
    const updates: Partial<IStore['state']> =
      typeof updater === 'function' ? updater(this.state) : updater;

    this.state = { ...this.state, ...updates };
    this.synapse.updateState(this.id, this.state, { log });
  }

  async runAsync<T>({ key, work, log = true }: RunAsync<T, IStore['state']>) {
    const errorKey = `${key}Error`;
    const storeKey = key || 'loading';

    this.setState({ [storeKey]: true, [errorKey]: null }, { log });

    try {
      const res = await work();
      this.setState({ [storeKey]: false }, { log });
      return res;
    } catch (error) {
      this.setState({ [storeKey]: false, [errorKey]: error }, { log });
      throw error;
    }
  }
}
