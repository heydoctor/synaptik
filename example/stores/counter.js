import { Store } from '../../src';

export default class CounterStore extends Store {
  static initialState = {
    count: 0,
  }

  increment = () => {
    this.state.count++
  }

  decrement = () => {
    this.state.count--;
  }
}
