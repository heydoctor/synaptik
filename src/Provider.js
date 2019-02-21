import React from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import Synapse from './Synapse';

export default class Provider extends React.Component {
  static propTypes = {
    value: PropTypes.shape(),
    stores: PropTypes.shape(),
  };

  constructor(props, context) {
    super(props, context);

    this.synapse = props.value
      ? props.value
      : new Synapse(props.stores, { logger: props.logger });
  }

  render() {
    return (
      <Context.Provider value={this.synapse}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
