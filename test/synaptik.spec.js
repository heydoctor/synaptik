import * as synaptik from '../src';

class TestStore extends synaptik.Store {
  state = {
    counter: 0,
  };
}

let synapse;
beforeEach(() => {
  synapse = new synaptik.Synapse({});
});

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
    store = new TestStore('test', synapse);
  });

  test('requires id and synapse', () => {
    expect(() => new TestStore()).toThrowErrorMatchingSnapshot();
    expect(() => new TestStore('test')).toThrowErrorMatchingSnapshot();
  });

  test('setState returns a promise', () => {
    const promise = store.setState({});
    expect(typeof promise.then).toEqual('function');
  });

  test('setState can take an updater function', async () => {
    const spy = jest.fn().mockImplementationOnce(() => ({}));
    const promise = await store.setState(spy);
    expect(spy).toHaveBeenCalledWith(store.state);
  });

  test('setState calls synapse.updateState', async () => {
    const spy = jest.fn().mockImplementationOnce(() => ({}));
    synapse.updateState = jest.fn();
    await store.setState(spy);
    expect(synapse.updateState).toHaveBeenCalledWith(store.id, store.state, {
      log: true,
    });
  });
});
