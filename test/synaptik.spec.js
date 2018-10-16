import * as synaptik from '../src/synaptik';

class TestStore extends synaptik.Store {
  state = {
    counter: 0,
  };
}

let vault;
beforeEach(() => {
  vault = new synaptik.Vault();
});

describe('createVault', () => {
  test('returns a vault instance', () => {
    let v = synaptik.createVault({
      test: TestStore
    });

    expect(v).toBeInstanceOf(synaptik.Vault);
  });
});

describe('Vault', () => {
  test('logger', () => {
    const logger = jest.fn();
    const vault = new synaptik.Vault({ logger });
    // logs by default
    vault.updateState();
    expect(logger).toHaveBeenCalled();

    logger.mockReset();

    // ignore logs
    vault.updateState(null, null, { log: false });
    expect(logger).not.toHaveBeenCalled();
  });

  test('updating state', () => {
    vault.updateState('test', {
      counter: 1,
    });
    const newState = vault.getState();
    expect(newState.test.counter).toEqual(1);
  });

  test('subscriptions', () => {
    const spy = jest.fn();

    // Subscribe to the vault
    const subscription = vault.subscribe(spy);
    vault.updateState('test', {
      counter: 1,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(vault.__state);


    // Unsubscribe to the vault
    subscription();

    vault.updateState('test', {
      counter: 2,
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = new TestStore('test', vault);
  });

  test('requires id and vault', () => {
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

  test('setState calls vault.updateState', async () => {
    const spy = jest.fn().mockImplementationOnce(() => ({}));
    vault.updateState = jest.fn();
    await store.setState(spy);
    expect(vault.updateState).toHaveBeenCalledWith(store.id, store.state, {
      log: true,
    });
  });
});
