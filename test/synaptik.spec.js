import React from 'react';
import { render,testHook, act, cleanup }  from 'react-testing-library';
import 'jest-dom/extend-expect'
import * as synaptik from '../src';

class CounterStore extends synaptik.Store {
  state = {
    counter: 0,
  };
  increment() {
    this.setState({ counter: this.state.counter + 1, })
  }
}

let synapse = new synaptik.Synapse({ counter: CounterStore });
beforeEach(() => {
  synapse = new synaptik.Synapse({ counter: CounterStore });
})
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
    store = new CounterStore('test', synapse);
  });

  test('requires id and synapse', () => {
    expect(() => new CounterStore()).toThrowErrorMatchingSnapshot();
    expect(() => new CounterStore('test')).toThrowErrorMatchingSnapshot();
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
  const Counter = () => {
    const state = synaptik.useSynapse(({ counter }) => ({ counter: counter.state.counter }))
    return (
      <div>Counter: {state.counter}</div>
    )
  }

  const App = () => (
    <synaptik.Provider synapse={synapse}>
      <Counter />
    </synaptik.Provider>
  )

  test('should return correct state', () => {
    const { getByText, rerender } = render(<App />);

    expect(getByText(/^Counter:/)).toHaveTextContent('Counter: 0')

    act(() => {
      synapse.stores.counter.increment()
    })

    expect(getByText(/^Counter:/)).toHaveTextContent('Counter: 1')
  })
})
