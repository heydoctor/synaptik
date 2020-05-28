import React from 'react';
import { render, act, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { createSynaptik, Store } from '..';
import { SynaptikInstance } from '../createSynaptik';

interface CounterState {
  count: number;
  updatingCount?: boolean;
}
class CounterStore extends Store<CounterState, typeof testStores> {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState(state => ({
      count: state.count + 1,
    }));
  };

  asyncIncrement = () =>
    this.runAsync({
      key: 'updatingCount',
      work: async () => {
        this.setState({
          count: this.state.count + 1,
        });
      },
    });
}

const testStores = {
  counter: CounterStore,
};

describe('synpatik', () => {
  let synaptik: SynaptikInstance<typeof testStores>;

  beforeEach(() => {
    synaptik = createSynaptik(testStores);
  });

  afterEach(cleanup);

  describe('createSynaptik', () => {
    test('updateState/getState', () => {
      synaptik.updateState('counter', {
        count: 1,
      });

      expect(synaptik.getState().counter.count).toEqual(1);

      expect(synaptik.getState()).toMatchInlineSnapshot(`
        Object {
          "counter": Object {
            "count": 1,
          },
        }
      `);
    });

    test('internal subscriptions', () => {
      const spy = jest.fn();

      // Subscribe to the synapse
      const unsubscribe = synaptik.subscribe(spy);
      synaptik.updateState('counter', {
        count: 1,
      });

      expect(spy).toHaveBeenCalledTimes(1);

      // Unsubscribe to the synapse
      unsubscribe();

      synaptik.updateState('counter', {
        count: 2,
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store', () => {
    test('requires id and synapse', () => {
      // @ts-ignore
      expect(() => new CounterStore()).toThrowErrorMatchingSnapshot();
      // @ts-ignore
      expect(() => new CounterStore('counter')).toThrowErrorMatchingSnapshot();
    });

    test('setState can take an updater function', () => {
      const spy = jest.fn().mockImplementationOnce(() => ({}));
      synaptik.stores.counter.setState(spy);
      expect(spy).toHaveBeenCalledWith(synaptik.stores.counter.state);
    });

    test('setState calls synapse.updateState', () => {
      const spy = jest.fn().mockImplementationOnce(() => ({}));
      synaptik.stores.counter.synapse.updateState = jest.fn();
      synaptik.stores.counter.setState(spy);
      expect(synaptik.stores.counter.synapse.updateState).toHaveBeenCalledWith(
        synaptik.stores.counter.id,
        synaptik.stores.counter.state
      );
    });

    test('#runAsync', async () => {
      const spy = jest.spyOn(synaptik.stores.counter, 'setState');

      await synaptik.stores.counter.asyncIncrement();

      expect(spy).toBeCalledTimes(3);
      expect(spy.mock.calls[0][0]).toMatchObject({ updatingCount: true, updatingCountError: null });
      expect(spy.mock.calls[1][0]).toMatchObject({ count: 1 });
      expect(spy.mock.calls[2][0]).toMatchObject({ updatingCount: false });
    });
  });

  describe('useSynapse', () => {
    test('should return correct state', () => {
      const Counter = () => {
        const [counter] = synaptik.useSynapse(({ counter }) => [counter.state.count]);
        return <div>Counter: {counter}</div>;
      };

      const App = () => (
        <synaptik.Provider>
          <Counter />
        </synaptik.Provider>
      );

      const { getByText } = render(<App />);

      expect(getByText(/^Counter:/)).toHaveTextContent('Counter: 0');

      act(() => {
        synaptik.stores.counter.increment();
      });

      expect(getByText(/^Counter:/)).toHaveTextContent('Counter: 1');
    });
  });
});
