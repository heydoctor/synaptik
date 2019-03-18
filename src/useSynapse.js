import React, { useContext, useState, useEffect } from 'react';
import Context from './Context';
import shallowEqual from './shallow-equal';

export default function useSynapse(selector) {
  const synapse = useContext(Context);
  const select = () => selector(synapse.stores);
  const [state, setState] = useState(select());

  const updateStateIfChanged = () => {
    const nextState = select();
    if (!shallowEqual(nextState, state)) {
      setState(nextState);
    }
  }

  useEffect(() => {
    updateStateIfChanged();
    return synapse.subscribe(() => {
      updateStateIfChanged()
    });
  });

  return state;
}
