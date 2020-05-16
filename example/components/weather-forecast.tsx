import React, { useEffect } from 'react';
import { useSynapse } from '../synaptik';

export default () => {
  const [forecast, loading, load] = useSynapse(
    ({ weather }) => [weather.state.forecast, weather.state.loading, weather.load] as const
  );

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {console.log('Rendering WeatherForecast')}
      <h2>Weather Forecast</h2>

      {loading || !forecast || !forecast.length ? (
        <span>Loading...</span>
      ) : (
        <>
          {forecast.map(day => (
            <div key={day.date}>
              <span>Date: {day.date}</span>
              <span>High: {day.high}</span>
              <span>Low: {day.low}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
