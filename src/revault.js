import React from 'react';
import PropTypes from 'prop-types';
import createReactContext from 'create-react-context';
import nextTick from 'tickedoff';

const Context = createReactContext({});

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
  static propTypes = {
    vault: PropTypes.shape(),
    stores: PropTypes.shape(),
  }

  constructor(props, context) {
    super(props, context);

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

class ConnectInternal extends React.PureComponent {
  unsubscribe = null;
  state = this.getObservedState();

  static propTypes = {
    select: PropTypes.func.isRequired,
    lifecycle: PropTypes.shape({
      didMount: PropTypes.func,
      didUpdate: PropTypes.func,
      willUnmount: PropTypes.func,
    })
  }

  static defaultProps = {
    lifecycle: {},
  };

  componentDidMount() {
    const { lifecycle, vault } = this.props;

    this.unsubscribe = vault.subscribe(() => {
      this.setState(this.getObservedState());
    });

    if (lifecycle.didMount) lifecycle.didMount(...this.getArgs());
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
    return [vault.stores, vault.getState()];
  }

  getObservedState() {
    const state = this.props.select(...this.getArgs());
    if (typeof state !== 'object') {
      throw new Error('Expected `select` to return an object.');
    }
    return state;
  }

  render() {
    const { children, vault, ...props } = this.props;

    return children(this.state, props);
  }
}

export function Connect(props) {
  return (
    <Context.Consumer>
      {vault => <ConnectInternal {...props} vault={vault} />}
    </Context.Consumer>
  );
}
