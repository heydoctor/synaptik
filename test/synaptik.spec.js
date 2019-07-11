import React from 'react';
import { render, testHook, act, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import * as synaptik from '../src';

class Store extends synaptik.Store {
  state = {
    counter: 0,
    favorites: {
      avenger: 'Iron Man',
    },
  };

  incrementCounter() {
    this.setState({ counter: this.state.counter + 1 });
  }
}

let synapse = new synaptik.Synapse({ testStore: Store });

beforeEach(() => {
  synapse = new synaptik.Synapse({ testStore: Store });
});

afterEach(cleanup);

describe('Synapse', () => {
  test('logger', () => {
    const logger = jest.fn();
    const synapse = new synaptik.Synapse({}, { logger });
    // logs by default
    synapse.updateState();
    expect(logger).toHaveBeenCalled();

    logger.mockReset();

    // ignore logs
    synapse.updateState(null, null, { log: false });
    expect(logger).not.toHaveBeenCalled();
  });

  test('updating state', () => {
    synapse.updateState('test', {
      counter: 1,
    });
    const newState = synapse.getState();
    expect(newState.test.counter).toEqual(1);
  });

  test('subscriptions', () => {
    const spy = jest.fn();

    // Subscribe to the synapse
    const subscription = synapse.subscribe(spy);
    synapse.updateState('test', {
      counter: 1,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(synapse.state);

    // Unsubscribe to the synapse
    subscription();

    synapse.updateState('test', {
      counter: 2,
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = new Store('test', synapse);
  });

  test('requires id and synapse', () => {
    expect(() => new Store()).toThrowErrorMatchingSnapshot();
    expect(() => new Store('test')).toThrowErrorMatchingSnapshot();
  });

  test('setState can take an updater function', () => {
    const spy = jest.fn().mockImplementationOnce(() => ({}));
    store.setState(spy);
    expect(spy).toHaveBeenCalledWith(store.state);
  });

  test('setState calls synapse.updateState', () => {
    const spy = jest.fn().mockImplementationOnce(() => ({}));
    synapse.updateState = jest.fn();
    store.setState(spy);
    expect(synapse.updateState).toHaveBeenCalledWith(store.id, store.state, {
      log: true,
    });
  });
});

describe('useSynapse', () => {
  test('selects state using a selector function', () => {
    const WithFunctionSelector = () => {
      const { count, favoriteAvenger } = synaptik.useSynapse(
        ({ testStore }) => ({
          count: testStore.state.counter,
          favoriteAvenger: testStore.state.favorites.avenger,
        })
      );

      return (
        <>
          <span>Count: {count}</span>
          <span>Favorite Avenger: {favoriteAvenger}</span>
        </>
      );
    };

    const { getByText, rerender } = render(
      <synaptik.Provider synapse={synapse}>
        <WithFunctionSelector />
      </synaptik.Provider>
    );

    expect(getByText(/^Count:/)).toHaveTextContent('Count: 0');

    act(() => {
      synapse.stores.testStore.incrementCounter();
    });

    expect(getByText(/^Count:/)).toHaveTextContent('Count: 1');
  });

  test('selects state using array of store keys', () => {
    const WithArraySelector = () => {
      const [count, favoriteAvenger] = synaptik.useSynapse([
        'testStore.state.counter',
        'testStore.state.favorites.avenger',
      ]);

      return (
        <>
          <span>Count: {count}</span>
          <span>Favorite Avenger: {favoriteAvenger}</span>
        </>
      );
    };

    const { getByText, rerender } = render(
      <synaptik.Provider synapse={synapse}>
        <WithArraySelector />
      </synaptik.Provider>
    );

    expect(getByText(/^Count:/)).toHaveTextContent('Count: 0');
    expect(getByText(/^Favorite Avenger:/)).toHaveTextContent(
      'Favorite Avenger: Iron Man'
    );

    act(() => {
      synapse.stores.testStore.incrementCounter();
    });

    expect(getByText(/^Count:/)).toHaveTextContent('Count: 1');
  });
});
