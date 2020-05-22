import { Synapse, ConstructorMap } from './Synapse';

type Updater<State extends object> = Partial<State> | ((state: State) => Partial<State>);

type RunAsync<T, S> = {
  key?: keyof S;
  work: () => T | Promise<T>;
  log?: boolean;
};

export class Store<S extends { state: object }, C extends ConstructorMap<C>> {
  stores = {} as {
    [K in keyof Synapse<C>['stores']]: Omit<
      Synapse<C>['stores'][K],
      'runAsync' | 'setState' | 'stores'
    >;
  };

  state = {} as S['state'];

  constructor(private id: keyof C, private synapse: Synapse<C>) {
    if (!id) throw new Error('Store requires an id');
    if (!synapse) throw new Error('Store requires a synapse instance');

    this.id = id;
    this.synapse = synapse;
    this.stores = synapse.stores;
  }

  setState = (updater: Updater<S['state']>, { log = true } = {}) =>
    new Promise(resolve => {
      const updates: Partial<S['state']> =
        typeof updater === 'function' ? updater(this.state) : updater;

      this.state = { ...this.state, ...updates };
      this.synapse.updateState(this.id, this.state, { log });

      return resolve(this.state);
    });

  runAsync = async <T>({ key, work, log = true }: RunAsync<T, S['state']>) => {
    const errorKey = `${key}Error`;
    const storeKey = key || 'loading';

    await this.setState({ [storeKey]: true, [errorKey]: null } as S['state'], { log });

    try {
      const res = await work();
      await this.setState({ [storeKey]: false } as S['state'], { log });
      return res;
    } catch (error) {
      await this.setState({ [storeKey]: false, [errorKey]: error } as S['state'], { log });
      throw error;
    }
  };
}
