import { detailedDiff } from 'deep-object-diff';

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

  console.group(groupName);
  logger('Added', '#18A76D', diff.added);
  logger('Updated', '#FDA429', diff.updated);
  logger('Deleted', '#f04545', diff.deleted);
  logger('Old state: ', '#555555', { ...prevState });
  logger('New state: ', '#555555', { ...newState });
  console.groupEnd(groupName);
};
