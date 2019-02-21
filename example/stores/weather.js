import { Store } from '../../src';
import immer from 'immer';

export default class WeatherStore extends Store {
  state = {
    loading: false,
    forecast: [],
  };

  load = () => {
    this.setState({ loading: true });

    setTimeout(() => {
      this.setState(
        immer(draft => {
          draft.loading = false;
          draft.forecast = [
            {
              date: 'today',
              high: 75,
              low: 70,
            },
          ];
        })
      );
    }, 1500);
  };
}
