import { Store } from '../../src';

export default class CounterStore extends Store {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState(state => ({
      count: state.count + 1,
    }));
  };

  decrement = () => {
    this.setState(state => ({
      count: state.count - 1,
    }));
  };
}
