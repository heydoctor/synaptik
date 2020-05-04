type VoidFunction<State> = (state: State) => void;
type Logger<T> = (oldState: T, newState: T) => void;

export type Constructor<T> = new (...args: any[]) => T;
export type InstancesOf<C extends Readonly<C>> = {
  [K in keyof C]: Omit<InstanceType<C[K]>, 'runAsync' | 'setState' | 'stores'>;
};
export type StoreStateOf<S extends Readonly<S>> = {
  [K in keyof S]: {
    // @ts-ignore
    state: S[K]['state'];
  };
};

export class Synapse<Constructors extends Readonly<Constructors>> {
  stores = {} as InstancesOf<Constructors>;
  state = {} as StoreStateOf<InstancesOf<Constructors>>;

  private counter: number = 0;
  private logger?: Logger<StoreStateOf<InstancesOf<Constructors>>>;
  private subscriptions = {} as Record<
    string,
    VoidFunction<StoreStateOf<InstancesOf<Constructors>>>
  >;

  constructor(
    stores: Constructors,
    config: { logger?: Logger<StoreStateOf<InstancesOf<Constructors>>> } = {}
  ) {
    this.logger = config.logger;

    Object.entries<Constructor<Constructors[keyof Constructors]>>(stores).forEach(([id, Store]) => {
      const key = id as keyof InstancesOf<Constructors>;
      const store = new Store(key, this) as InstancesOf<Constructors>[keyof InstancesOf<
        Constructors
      >] &
        StoreStateOf<InstancesOf<Constructors>>[keyof InstancesOf<Constructors>];

      this.stores[key] = store;
      this.updateState(key, store.state, { log: false });
    });
  }

  getState() {
    return this.state;
  }

  updateState<T extends keyof InstancesOf<Constructors>>(
    storeId: T,
    state: any,
    { log = true } = {}
  ) {
    const oldState = { ...this.state };
    this.state[storeId] = state;
    this.notify();

    if (log && this.logger) {
      this.logger(oldState, this.state);
    }
  }

  subscribe(callback: VoidFunction<StoreStateOf<InstancesOf<Constructors>>>) {
    const id = ++this.counter;
    this.subscriptions[id] = callback;

    return () => {
      delete this.subscriptions[id];
    };
  }

  notify = () => {
    Object.keys(this.subscriptions).forEach(id => {
      const fn = this.subscriptions[id];
      if (typeof fn === 'function') {
        fn(this.state);
      }
    });
  };
}
