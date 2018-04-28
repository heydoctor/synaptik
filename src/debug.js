/* eslint-disable no-console */

import { detailedDiff } from 'deep-object-diff';
import Store from './store';
import Vault from './vault';

/** Attach debug methods to the vault */
Vault.prototype.debugMode = true;
Vault.prototype.logState = function logState() {
  for (const [key, value] of Object.entries(this.stores)) {
    console.log(`%c${key}\n`, 'font-weight:bold', value.state);
  }
};

/** Attach debug methods to the store */

const logDiff = (message, color, object) => {
  if (object && Object.keys(object).length) {
    console.log(
      `%c${message}`,
      `color: ${color}; font-weight: bold;\n`,
      object
    );
  }
};

Store.prototype.debugMode = true;
Store.prototype.logStateChange = function logStateChange(prevState, newState) {
  const diff = detailedDiff(prevState, newState);

  const groupName = `${this.id} updated:`;
  console.groupCollapsed(groupName);

  logDiff('Added', '#18A76D', diff.added);
  logDiff('Updated', '#FDA429', diff.updated);
  logDiff('Deleted', '#f04545', diff.deleted);
  logDiff('Old state: ', '#000000', prevState);
  logDiff('New state: ', '#000000', newState);

  console.groupEnd(groupName);
};
