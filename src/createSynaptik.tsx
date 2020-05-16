import React, { useContext, useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import shallowEqual from 'shallowequal';
import { Synapse } from './Synapse';

type State<C extends { [K in keyof C]: new (...args: any[]) => any }> = {
  [K in keyof C]: InstanceType<C[K]>;
};

export function createSynaptik<Constructors extends Readonly<Constructors>>(
  synapse: Synapse<Constructors>
) {
  const Context = React.createContext(synapse);

  const Provider: React.FC = ({ children }) => (
    <Context.Provider value={synapse}>{children}</Context.Provider>
  );

  function useSynapse<T extends (state: State<Constructors>) => ReturnType<T>>(
    selector: T,
    dependencies: any[] = []
  ) {
    const synapse = useContext(Context);
    const select = useCallback(() => selector(synapse.stores), []);
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

      const unsubscribe = synapse.subscribe(maybeUpdateState);

      maybeUpdateState();

      return () => {
        unsubscribe();
        isUnsubscribed = true;
      };
    }, dependencies);

    return state;
  }

  function connect<T extends (state: State<Constructors>) => ReturnType<T>>(selector: T) {
    return (Component: React.ComponentType<any>) =>
      forwardRef((props, ref) => {
        const state = useSynapse(selector);
        return <Component {...state} {...props} ref={ref} />;
      });
  }

  return {
    Provider,
    useSynapse,
    connect,
  };
}
