const proxies = new WeakSet();

// Ported from https://github.com/GoogleChrome/proxy-polyfill#example
function observe(o, callback) {
  function buildProxy(prefix, o) {
    return new Proxy(o, {
      get(target, prop) {
        // return a new proxy if possible, add to prefix
        const val = target[prop];
        if (typeof val === 'object' && !proxies.has(val)) {
          const proxy = buildProxy(prefix + prop + '.', val);
          proxies.add(proxy);
          target[prop] = proxy;
          return proxy;
        }

        return val;  // primitive, ignore
      },
      set(target, prop, value) {
        target[prop] = value;
        callback(prefix + prop, target[prop]);
        return true;
      },
    });
  }

  return buildProxy('', o);
}

export default class Store {
  static initialState = {}

  constructor(id, synapse) {
    if (!id) throw new Error('Store requires an id');
    if (!synapse) throw new Error('Store requires a synapse instance');

    this.id = id;
    this.synapse = synapse;

    this.state = observe(this.constructor.initialState, (path, value) => {
      console.log(`${id}.${path} updated to: `, value)
      synapse.updateState(id, this.state);
    });
  }
}
