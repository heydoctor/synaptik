import { Store } from '../../src';
import immer from 'immer';

export default class WeatherStore extends Store {
  static initialState = {
    loading: false,
    forecast: [],
  };

  load = () => {
    this.state.loading = true;

    setTimeout(() => {
      this.state.loading = false;
      this.state.forecast = [
        {
          date: 'today',
          high: 75,
          low: 70,
        },
      ]
    }, 1500);
  };
}
