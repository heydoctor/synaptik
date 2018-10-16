import React from 'react';
import { connect } from '../../src/synaptik';

const enhancer = connect(
  ({ weather }) => ({
    forecast: weather.state.forecast,
    loading: weather.state.loading,
  }),
  {
    didMount({ weather }, props) {
      weather.load(props.zipCode);
    },
  }
);

export default enhancer(({ forecast, loading }) => (
  <div>
    {console.log('Rendering WeatherForecast')}
    <h2>Weather Forecast</h2>

    {loading || !forecast || !forecast.length ? (
      <span>Loading...</span>
    ) : (
      <div>
        {forecast.map(day => (
          <div key={day.date}>
            <span>Date: {day.date}</span>
            <span>High: {day.high}</span>
            <span>Low: {day.low}</span>
          </div>
        ))}
      </div>
    )}
  </div>
));
