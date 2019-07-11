import React, { useContext, useState, useEffect, useRef } from 'react';
import get from 'lodash.get';
import Context from './Context';
import shallowEqual from './shallow-equal';

export default function useSynapse(selector, dependencies = []) {
  const synapse = useContext(Context);
  const select = () =>
    Array.isArray(selector)
      ? selector.reduce((state, key) => {
          state.push(get(synapse.stores, key));
          return state;
        }, [])
      : selector(synapse.stores);
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
      if (
        nextState === stateRef.current ||
        shallowEqual(nextState, stateRef.current)
      ) {
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
