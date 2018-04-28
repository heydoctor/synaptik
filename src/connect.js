import React from 'react';
import { Consumer as VaultConsumer } from './provider';

const hasObjectChanged = (current, next) => {
  for (const key of Object.keys(next)) {
    if (current[key] !== next[key]) {
      return true;
    }
  }

  return false;
};

export class Connect extends React.Component {
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

    return stateChanged;
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

export default props => (
  <VaultConsumer>{vault => <Connect {...props} vault={vault} />}</VaultConsumer>
);
