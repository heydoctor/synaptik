import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider as VaultProvider } from '../src';
import * as stores from './stores';
import TodoList from './components/todo-list';
import WeatherForecast from './components/weather-forecast';
console.log(stores);
const App = () => (
  <VaultProvider stores={stores}>
    <Fragment>
      <TodoList />
      <WeatherForecast />
    </Fragment>
  </VaultProvider>
);

render(<App />, window.root);
