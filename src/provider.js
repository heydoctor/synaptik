import React from 'react';
import createReactContext from 'create-react-context';
import createVault from './create-vault';

const Context = createReactContext({});

export const Consumer = Context.Consumer;

export default class Provider extends React.Component {
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
