type Logger<T> = (oldState: StoreState<T>, newState: StoreState<T>) => void;
// @ts-ignore
type StoreState<C> = InstanceType<C[keyof C] & { state: object }>['state'];
// @ts-ignore
type State<C> = { [K in keyof C]: InstanceType<C[K]>['state'] };

export class Synapse<C extends Readonly<C>> {
  stores = {} as { [K in keyof C]: InstanceType<C[K]> };

  private counter = 0;
  private logger?: Logger<C>;
  private subscriptions: Record<string, (state: State<C>) => void> = {};

  constructor(stores: C, config: { logger?: Logger<C> } = {}) {
    this.logger = config.logger;

    Object.entries<new (...args: any[]) => C[keyof C]>(stores).forEach(([id, Store]) => {
      const key = id as keyof C;
      const store = new Store(key, this) as InstanceType<C[keyof C]> & {
        state: StoreState<C>;
      };

      this.stores[key] = store;
      this.updateState(key, store.state, { log: false });
    });
  }

  updateState<K extends keyof C>(
    storeId: K,
    // @ts-ignore
    state: InstanceType<C[K]>['state'],
    { log = true } = {}
  ) {
    const oldState = { ...this.state[storeId] };
    // @ts-ignore
    this.stores[storeId]['state'] = state;
    this.notify();

    if (log && this.logger) {
      this.logger(oldState, this.state[storeId]);
    }
  }

  get state() {
    return Object.entries<InstanceType<C[keyof C]>>(this.stores).reduce((acc, [id, store]) => {
      // @ts-ignore
      acc[id as keyof C] = store['state'];
      return acc;
    }, {} as State<C>);
  }

  subscribe(callback: (state: State<C>) => void) {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function');
    }

    const id = ++this.counter;
    this.subscriptions[id] = callback;

    return () => {
      delete this.subscriptions[id];
    };
  }

  notify = () => {
    Object.values(this.subscriptions).forEach(fn => fn(this.state));
  };
}
