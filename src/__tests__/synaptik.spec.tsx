import React from 'react';
import { render, act, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import * as synaptik from '..';

class CounterStore extends synaptik.Store<CounterStore, typeof stores> {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState(state => ({
      count: state.count + 1,
    }));
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
      synapse.updateState('counter', { count: 0 });
      expect(logger).toHaveBeenCalled();

      logger.mockReset();

      // ignore logs
      synapse.updateState('counter', { count: 1 }, { log: false });
      expect(logger).not.toHaveBeenCalled();
    });

    test('updating state', () => {
      synapse.updateState('counter', {
        count: 1,
      });

      expect(synapse.state.counter.count).toEqual(1);

      expect(synapse.state).toMatchInlineSnapshot(`
        Object {
          "counter": Object {
            "count": 1,
          },
        }
      `);
    });

    test('subscriptions', () => {
      const spy = jest.fn();

      // Subscribe to the synapse
      const unsubscribe = synapse.subscribe(spy);
      synapse.updateState('counter', {
        count: 1,
      });

      expect(spy).toHaveBeenCalledTimes(1);

      // Unsubscribe to the synapse
      unsubscribe();

      synapse.updateState('counter', {
        count: 2,
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
      // @ts-expect-error
      expect(() => new CounterStore()).toThrowErrorMatchingSnapshot();
      // @ts-expect-error
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
      // @ts-expect-error
      expect(synapse.updateState).toHaveBeenCalledWith(store.id, store.state, {
        log: true,
      });
    });
  });

  describe('useSynapse', () => {
    test('should return correct state', () => {
      const { Provider, useSynapse } = synaptik.createSynaptik(synapse);

      const Counter = () => {
        const [counter] = useSynapse(({ counter }) => [counter.state.count]);
        return <div>Counter: {counter}</div>;
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
