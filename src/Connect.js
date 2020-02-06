import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';

class ConnectConsumer extends React.PureComponent {
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
    let { lifecycle, synapse } = this.props;

    this.unsubscribe = synapse.subscribe(() => {
      this.setState(this.getObservedState());
    });

    if (lifecycle.didMount) lifecycle.didMount(...this.getArgs());
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
    let { synapse, lifecycle, select, ...props } = this.props;
    return [synapse.stores, props];
  }

  getObservedState() {
    let state = this.props.select(...this.getArgs());
    if (typeof state !== 'object') {
      throw new Error('Expected `select` to return an object.');
    }
    return state;
  }

  render() {
    let { children, synapse, ...props } = this.props;

    return children(this.state, props);
  }
}

export default function Connect(props) {
  return (
    <Context.Consumer>
      {synapse => <ConnectConsumer {...props} synapse={synapse} />}
    </Context.Consumer>
  );
}

export const connect = (selector, lifecycle = {}) => Component =>
  forwardRef((props, ref) => (
    <Connect {...props} select={selector} lifecycle={lifecycle}>
      {state => <Component {...state} {...props} ref={ref} />}
    </Connect>
  ));
