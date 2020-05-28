import { ConstructorMap, Synapse, StoreMap } from './createSynaptik';

type Updater<State = {}> = Partial<State> | ((state: State) => Partial<State>);

type RunAsync<T, S> = {
  key?: keyof S;
  work: () => T | Promise<T>;
  log?: boolean;
};

export class Store<State, Stores extends ConstructorMap> {
  id: string;
  synapse = {} as Synapse<Stores>;
  stores = {} as StoreMap<Stores>;
  state = {} as State;

  constructor(id: string, synapse: Synapse<Stores>) {
    if (!id) throw new Error('Store requires an id');
    if (!synapse) throw new Error('Store requires a synapse instance');

    this.id = id;
    this.synapse = synapse;
    this.stores = synapse.stores;
  }

  setState = (updater: Updater<State>) => {
    const updates: Partial<State> = typeof updater === 'function' ? updater(this.state) : updater;

    this.state = { ...this.state, ...updates };
    this.synapse.updateState(this.id, this.state);
  };

  runAsync = async <T>({ key, work }: RunAsync<T, State>) => {
    const errorKey = `${key}Error`;
    const storeKey = key || 'loading';

    // @ts-ignore
    this.setState({ [storeKey]: true, [errorKey]: null });

    try {
      const res = await work();
      // @ts-ignore
      this.setState({ [storeKey]: false });
      return res;
    } catch (error) {
      // @ts-ignore
      this.setState({ [storeKey]: false, [errorKey]: error });
      throw error;
    }
  };
}
