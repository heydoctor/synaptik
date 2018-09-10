import { Store } from '../../src/revault';
import immer from 'immer';

export default class WeatherStore extends Store {
  state = {
    loading: false,
    forecast: [],
  };

  load = () => {
    this.setState({ loading: true });

    fetch(
      'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
    )
      .then(r => r.json())
      .then(data => {
        setTimeout(() => {
          this.setState(
            immer(draft => {
              draft.loading = false;
              draft.forecast = data.query.results.channel.item.forecast;
            })
          );
        }, 1000);
      });
  };
}
