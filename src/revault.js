import React from 'react';
import createReactContext from 'create-react-context';
import nextTick from 'tickedoff';

const Context = createReactContext({});

const hasObjectChanged = (current, next) => {
  for (const key of Object.keys(next)) {
    if (current[key] !== next[key]) {
      return true;
    }
  }

  return false;
};

export const createVault = (stores = {}, options = {}) => {
  const storeIds = Object.keys(stores);
  if (!storeIds.length) {
    throw new Error(
      'Provide at least one store while creating the vault. If you are having trouble, make sure you pass <Provider> either a valid vault or hash of Stores.'
    );
  }

  const vault = new Vault(options);

  storeIds.forEach(id => {
    const Store = stores[id];
    const instance = new Store(id, vault, options);
    vault.stores[id] = instance;
    vault.updateState(id, instance.state);
  });

  return vault;
};

export class Vault {
  __state = {};
  __subscriptions = {};
  __counter = 0;
  stores = {};

  constructor() {
    if (this.debugMode) {
      window.VAULT = this;
    }
  }

  getState() {
    return this.__state;
  }

  updateState(storeName, state) {
    this.__state[storeName] = state;
    this.notify();
  }

  subscribe(fn) {
    const id = ++this.__counter;
    this.__subscriptions[id] = fn;

    return () => {
      delete this.__subscriptions[id];
    };
  }

  notify() {
    Object.keys(this.__subscriptions).forEach(id => {
      const fn = this.__subscriptions[id];
      if (!fn) return;
      fn(this.state);
    });
  }
}

export class Store {
  constructor(id, vault, opts = {}) {
    this.id = id;
    this.vault = vault;
    this.logStateChanges = opts.logStateChanges || true;
  }

  setState(updater, cb, { hideStateChanges = false } = {}) {
    nextTick(() => {
      let stateUpdates;

      if (typeof updater === 'function') {
        stateUpdates = updater(this.state);
      } else {
        stateUpdates = updater;
      }

      const nextState = { ...this.state, ...stateUpdates };

      if (!hideStateChanges && this.debugMode && this.logStateChanges) {
        this.logStateChange(this.state, nextState);
      }

      this.state = nextState;
      this.vault.updateState(this.id, this.state);

      if (typeof cb === 'function') cb(this.state);
    });
  }
}

export class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.vault = props.vault ? props.vault : createVault(props.stores);
  }

  render() {
    return (
      <Context.Provider value={this.vault}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

const getPassedProps = props => {
  const { lifecycle, vault, select, ...plucked } = props;
  return plucked;
};

class ConnectInternal extends React.Component {
  unsubscribe = null;
  lastObservedState = null;

  static defaultProps = {
    select: () => {},
    lifecycle: {},
  };

  componentDidMount() {
    const { lifecycle, vault } = this.props;

    this.unsubscribe = vault.subscribe(() => {
      this.setState(vault.getState());
    });

    if (lifecycle.didMount) lifecycle.didMount(...this.getArgs());
  }

  componentDidCatch(err) {
    console.log(err);
  }

  shouldComponentUpdate(nextProps) {
    const { lifecycle } = this.props;
    if (lifecycle.shouldUpdate)
      return lifecycle.shouldUpdate(...this.getArgs());

    const stateChanged = hasObjectChanged(
      this.lastObservedState,
      this.getObservedState()
    );
    const propsChanged = hasObjectChanged(getPassedProps(this.props), getPassedProps(nextProps));

    return stateChanged || propsChanged;
  }

  componentDidUpdate() {
    const { lifecycle } = this.props;
    if (lifecycle.didUpdate) lifecycle.didUpdate(...this.getArgs());
  }

  componentWillUnmount() {
    this.unsubscribe();

    const { lifecycle } = this.props;
    if (lifecycle.willUnmount) lifecycle.willUnmount(...this.getArgs());
  }

  getArgs() {
    const { vault } = this.props;
    return [vault.stores, vault.state];
  }

  getObservedState() {
    const { select } = this.props;
    const state = select(...this.getArgs());
    if (typeof state !== 'object') {
      throw new Error('The "select" prop must return an object.');
    }
    this.lastObservedState = state;
    return state;
  }

  render() {
    const { children, vault, ...props } = this.props;
    const observedState = this.getObservedState();

    return children(observedState, props);
  }
}

export function Connect(props) {
  return (
    <Context.Consumer>
      {vault => <ConnectInternal {...props} vault={vault} />}
    </Context.Consumer>
  );
}
