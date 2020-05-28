import { Store } from '../../src';
import immer from 'immer';
import { Stores } from '../synaptik';

type Forecast = {
  date: string;
  high: number;
  low: number;
};

interface WeatherState {
  loading: boolean;
  forecast: Forecast[];
}

export default class WeatherStore extends Store<WeatherState, Stores> {
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
