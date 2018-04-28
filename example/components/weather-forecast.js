import React from 'react';
import { Connect } from '../../src/revault';

export default () => (
  <Connect
    select={({ weather }) => ({
      forecast: weather.state.forecast,
      loading: weather.state.loading,
    })}
    lifecycle={{
      didMount({ weather }) {
        weather.load();
      },
    }}
  >
    {state => (
      <div>
        {console.log('Rendering WeatherForecast')}
        <h2>Weather Forecast</h2>

        {state.loading || !state.forecast || !state.forecast.length ? (
          <span>Loading...</span>
        ) : (
          <div>
            {state.forecast.map(day => (
              <div key={day.date}>
                <span>Date: {day.date}</span>
                <span>High: {day.high}</span>
                <span>Low: {day.low}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </Connect>
);
