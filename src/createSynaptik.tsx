import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  ComponentType,
} from 'react';
import shallowEqual from 'shallowequal';

type SubscriptionFn = (state: any) => any;

export type ConstructorMap = Record<string, new (...args: any[]) => any>;

export type StoreMap<T extends ConstructorMap> = {
  [P in keyof T]?: InstanceType<T[P]>;
};

export type Synapse<Stores extends ConstructorMap> = {
  subscribe: (subscription: SubscriptionFn) => () => void;
  notify: () => void;
  updateState: (id: string, newState: any) => void;
  getState: () => {
    [P in keyof Stores]?: InstanceType<Stores[P]>['state'];
  };
  stores: StoreMap<Stores>;
};

export interface SynaptikInstance<Stores extends ConstructorMap> extends Synapse<Stores> {
  Provider: ComponentType;
  useSynapse: <TSelected>(
    selector: (stores: StoreMap<Stores>) => TSelected,
    dependencies?: any[]
  ) => TSelected;
  connect: <TSelected>(
    selector: (stores: StoreMap<Stores>) => TSelected,
    dependencies?: any[]
  ) => (Component: ComponentType) => any;
}

export function createSynaptik<T extends ConstructorMap>(passedStores: T): SynaptikInstance<T> {
  const state: {
    [P in keyof T]?: InstanceType<T[P]>['state'];
  } = {};
  const stores: StoreMap<T> = {};
  const subscriptions: Map<number, SubscriptionFn> = new Map();
  let currentSubscriptionId = 0;

  function notify() {
    for (const fn of subscriptions.values()) {
      fn(state);
    }
  }

  function subscribe(subscription: SubscriptionFn) {
    if (typeof subscription !== 'function') {
      throw new Error('Subscription must be a function');
    }

    const id = ++currentSubscriptionId;
    subscriptions.set(id, subscription);

    return () => {
      subscriptions.delete(id);
    };
  }

  function getState() {
    return state;
  }

  function updateState(storeId: keyof T, newState: any) {
    state[storeId] = newState;
    notify();
  }

  const synapse = {
    stores,
    getState,
    updateState,
    subscribe,
    notify,
  };

  Object.entries(passedStores).forEach(([id, Store]) => {
    const store = new Store(id, synapse);
    stores[id as keyof T] = store;
    updateState(id, store.state);
  });

  const Context = React.createContext(synapse);

  const Provider: React.FC = ({ children }) => (
    <Context.Provider value={synapse}>{children}</Context.Provider>
  );

  function useSynapse<TSelected>(
    selector: (stores: StoreMap<T>) => TSelected,
    dependencies: any[] = []
  ) {
    const { subscribe } = useContext(Context);
    const select = useCallback(() => selector(stores), []);
    const [state, setState] = useState(select());

    // By default, our effect only fires on mount and unmount, meaning it won't see the
    // changes to state, so we use a mutable ref to track the current value
    const stateRef = useRef(state);

    useEffect(() => {
      // Helps to avoid running stale listeners after unmount
      let isUnsubscribed = false;

      const maybeUpdateState = () => {
        if (isUnsubscribed) {
          return;
        }

        const nextState = select();

        // Checking referential equality grants perf boost if selector is memoized
        if (nextState === stateRef.current || shallowEqual(nextState, stateRef.current)) {
          return;
        }

        stateRef.current = nextState;
        setState(nextState);
      };

      const unsubscribe = subscribe(maybeUpdateState);

      maybeUpdateState();

      return () => {
        unsubscribe();
        isUnsubscribed = true;
      };
    }, dependencies);

    return state;
  }

  function connect<TSelected>(
    selector: (stores: StoreMap<T>) => TSelected,
    dependencies: any[] = []
  ) {
    return (Component: ComponentType<any>) =>
      forwardRef((props, ref) => {
        const state = useSynapse(selector, dependencies);
        return <Component {...state} {...props} ref={ref} />;
      });
  }

  return {
    Provider,
    useSynapse,
    connect,
    ...synapse,
  };
}
