export type ConstructorMap<T> = Record<keyof T, new (...args: any[]) => any>;

type Logger<T extends ConstructorMap<T>> = (
  oldState: StoreState<T>,
  newState: StoreState<T>
) => void;

export type MapClassInstances<T extends ConstructorMap<T>> = {
  [K in keyof T]: new (...args: any[]) => InstanceType<T[K]>;
};

export type Stores<T extends ConstructorMap<T>> = {
  [K in keyof T]: InstanceType<T[K]>;
};

type StoreState<T extends ConstructorMap<T>> = {
  [K in keyof T]: Stores<T>[K]['state'];
};

export class Synapse<C extends ConstructorMap<C>> {
  stores = {} as Stores<C>;

  private counter = 0;
  private logger?: Logger<C>;
  private subscriptions: Record<string, () => void> = {};

  constructor(stores: C, config: { logger?: Logger<C> } = {}) {
    this.logger = config.logger;

    Object.entries<MapClassInstances<C>[keyof C]>(stores).forEach(([id, Store]) => {
      const key = id as keyof C;
      const store = new Store(key, this);

      this.stores[key] = store;
      this.updateState(key, store.state, { log: false });
    });
  }

  updateState<K extends keyof Stores<C>, S extends object>(
    storeId: K,
    state: S,
    { log = true } = {}
  ) {
    const oldState = { ...this.state[storeId] };

    this.stores[storeId].state = state;
    this.notify();

    if (log && this.logger) {
      this.logger(oldState, this.state[storeId]);
    }
  }

  get state() {
    return Object.entries<Stores<C>[keyof C]>(this.stores).reduce((acc, [id, store]) => {
      acc[id as keyof C] = store['state'];
      return acc;
    }, {} as StoreState<C>);
  }

  subscribe(callback: () => void) {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function');
    }

    const id = ++this.counter;
    this.subscriptions[id] = callback;

    return () => {
      delete this.subscriptions[id];
    };
  }

  notify = () => Object.values(this.subscriptions).forEach(fn => fn());
}
