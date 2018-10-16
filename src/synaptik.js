import React from 'react';
import PropTypes from 'prop-types';
import createReactContext from 'create-react-context';
import isEqual from 'react-fast-compare';

const Context = createReactContext({});

export const createVault = (stores = {}, options = {}) => {
  let vault = new Vault(options);

  Object.keys(stores).forEach(id => {
    let Store = stores[id];
    let instance = new Store(id, vault, options);
    vault.stores[id] = instance;
    vault.updateState(id, instance.state, { log: false });
  });

  return vault;
};

export class Vault {
  __state = {};
  __subscriptions = {};
  __counter = 0;
  stores = {};

  constructor({ logger } = {}) {
    this.logger = logger;
  }

  getState() {
    return this.__state;
  }

  updateState(storeId, state, { log = true } = {}) {
    let oldState = { ...this.__state };
    this.__state[storeId] = state;
    this.notify();

    if (log && this.logger) {
      this.logger(oldState, this.__state);
    }
  }

  subscribe(fn) {
    let id = ++this.__counter;
    this.__subscriptions[id] = fn;

    return () => {
      delete this.__subscriptions[id];
    };
  }

  notify() {
    Object.keys(this.__subscriptions).forEach(id => {
      let fn = this.__subscriptions[id];
      typeof fn === 'function' && fn(this.__state);
    });
  }
}

export class Store {
  constructor(id, vault) {
    if (!id) throw new Error('Store requires an id');
    if (!vault) throw new Error('Store requires a vault instance');

    this.id = id;
    this.vault = vault;
    this.state = {};
  }

  setState(updater, { log = true } = {}) {
    return Promise.resolve().then(() => {
      let updates =
        typeof updater === 'function' ? updater(this.state) : updater;
      this.state = { ...this.state, ...updates };
      this.vault.updateState(this.id, this.state, { log });
    });
  }
}

export class Provider extends React.Component {
  static propTypes = {
    vault: PropTypes.shape(),
    stores: PropTypes.shape(),
  };

  constructor(props, context) {
    super(props, context);

    this.vault = props.vault
      ? props.vault
      : createVault(props.stores, { logger: props.logger });
  }

  render() {
    return (
      <Context.Provider value={this.vault}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

class ConnectConsumer extends React.Component {
  unsubscribe = null;
  state = this.getObservedState();

  static propTypes = {
    select: PropTypes.func.isRequired,
    lifecycle: PropTypes.shape({
      didMount: PropTypes.func,
      didUpdate: PropTypes.func,
      willUnmount: PropTypes.func,
    }),
  };

  static defaultProps = {
    lifecycle: {},
  };

  componentDidMount() {
    let { lifecycle, vault } = this.props;

    this.unsubscribe = vault.subscribe(() => {
      this.setState(this.getObservedState());
    });

    if (lifecycle.didMount) lifecycle.didMount(...this.getArgs());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    let { lifecycle } = this.props;
    if (lifecycle.didUpdate) lifecycle.didUpdate(...this.getArgs());
  }

  componentWillUnmount() {
    this.unsubscribe();

    let { lifecycle } = this.props;
    if (lifecycle.willUnmount) lifecycle.willUnmount(...this.getArgs());
  }

  getArgs() {
    let { vault, lifecycle, select, ...props } = this.props;
    return [vault.stores, props];
  }

  getObservedState() {
    let state = this.props.select(...this.getArgs());
    if (typeof state !== 'object') {
      throw new Error('Expected `select` to return an object.');
    }
    return state;
  }

  render() {
    let { children, vault, ...props } = this.props;

    return children(this.state, props);
  }
}

export function Connect(props) {
  return (
    <Context.Consumer>
      {vault => <ConnectConsumer {...props} vault={vault} />}
    </Context.Consumer>
  );
}

export function connect(selector, lifecycle = {}) {
  return Component => {
    return props => (
      <Connect {...props} select={selector} lifecycle={lifecycle}>
        {state => <Component {...state} {...props} />}
      </Connect>
    );
  };
}
