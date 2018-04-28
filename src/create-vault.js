import Vault from './vault';

const createVault = (stores = {}, options = {}) => {
  const storeIds = Object.keys(stores);
  if (!storeIds.length) {
    throw new Error(
      'Provide at least one store while creating the vault. If you are having trouble, make sure you pass <Provider> either a valid vault or hash of Stores.'
    );
  }

  const vault = new Vault(options);

  storeIds.forEach(id => {
    const Store = stores[id];
    const instance = new Store(id, vault, options);
    vault.stores[id] = instance;
    vault.updateState(id, instance.state);
  });

  return vault;
};

export default createVault;
