import { Store } from '../../src';
import { Stores } from '../synaptik';

export default class CounterStore extends Store<CounterStore, Stores> {
  state: { count: number } = {
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
