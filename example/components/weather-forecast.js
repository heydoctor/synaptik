import React, { useEffect } from 'react';
import { useSynapse } from '../../src';

export default function WeatherForecast() {
  const { load, loading, forecast } = useSynapse(({ weather }) => ({
    forecast: weather.state.forecast,
    loading: weather.state.loading,
    load: weather.load,
  }))

  useEffect(() => { load() }, [])

  return (
    <div>
      {console.log('Rendering WeatherForecast')}
      <h2>Weather Forecast</h2>

      {loading || !forecast.length ? (
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
  )
}
