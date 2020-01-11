const detailedDiff = require('deep-object-diff').detailedDiff;

const logger = (message, color, object) => {
  if (object && Object.keys(object).length) {
    console.log(
      `%c${message}`,
      `color: ${color}; font-weight: bold;\n`,
      object
    );
  }
};

export default function logStateChange(prevState, newState) {
  const diff = detailedDiff(prevState, newState);
  const groupName = `Vault Update`;

  console.groupCollapsed(groupName);
  logger('Added', '#18A76D', diff.added);
  logger('Updated', '#FDA429', diff.updated);
  logger('Deleted', '#f04545', diff.deleted);
  logger('Old state: ', '#555555', Object.assign({}, prevState));
  logger('New state: ', '#555555', Object.assign({}, newState))
  console.groupEnd(groupName);
};
