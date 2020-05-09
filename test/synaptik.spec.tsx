import React from 'react';
import { render, act, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import * as synaptik from '../src';

class CounterStore extends synaptik.Store<CounterStore, typeof stores> {
  state = {
    counter: 0,
  };

  increment = () => {
    this.setState({ counter: this.state.counter + 1 });
  };
}

const stores = {
  counter: CounterStore,
};

describe('synpatik', () => {
  let synapse: synaptik.Synapse<typeof stores>;

  beforeEach(() => {
    synapse = new synaptik.Synapse(stores);
  });

  afterEach(cleanup);

  describe('Synapse', () => {
    test('logger', () => {
      const logger = jest.fn();
      const synapse = new synaptik.Synapse(stores, { logger });

      // logs by default
      synapse.updateState('counter', {});
      expect(logger).toHaveBeenCalled();

      logger.mockReset();

      // ignore logs
      synapse.updateState(null, null, { log: false });
      expect(logger).not.toHaveBeenCalled();
    });

    test('updating state', () => {
      synapse.updateState('counter', {
        counter: 1,
      });

      const newState = synapse.getState();
      expect(newState.counter.counter).toEqual(1);

      expect(synapse.getState()).toMatchInlineSnapshot(`
        Object {
          "counter": Object {
            "counter": 1,
          },
        }
      `);
    });

    test('subscriptions', () => {
      const spy = jest.fn();

      // Subscribe to the synapse
      const subscription = synapse.subscribe(spy);
      synapse.updateState('counter', {
        counter: 1,
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(synapse.state);

      // Unsubscribe to the synapse
      subscription();

      synapse.updateState('counter', {
        counter: 2,
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store', () => {
    let store: CounterStore;

    beforeEach(() => {
      store = new CounterStore('counter', synapse);
    });

    test('requires id and synapse', () => {
      expect(() => new CounterStore()).toThrowErrorMatchingSnapshot();
      expect(() => new CounterStore('counter')).toThrowErrorMatchingSnapshot();
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
    test('should return correct state', () => {
      const { Provider, useSynapse } = synaptik.createSynaptik(synapse);

      const Counter = () => {
        const state = useSynapse(({ counter }) => ({ counter: counter.state.counter }));
        return <div>Counter: {state.counter}</div>;
      };

      const App = () => (
        <Provider>
          <Counter />
        </Provider>
      );

      const { getByText } = render(<App />);

      expect(getByText(/^Counter:/)).toHaveTextContent('Counter: 0');

      act(() => {
        synapse.stores.counter.increment();
      });

      expect(getByText(/^Counter:/)).toHaveTextContent('Counter: 1');
    });
  });
});
