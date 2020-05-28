import { Store } from '../../src';
import { Stores } from '../synaptik';

interface CounterState {
  count: number;
}

export default class CounterStore extends Store<CounterState, Stores> {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState(state => ({
      count: state.count + 1,
    }));

    this.stores.todos.addTodo('Access other store ✅');
  };

  decrement = () => {
    this.setState(state => ({
      count: state.count - 1,
    }));
  };
}
