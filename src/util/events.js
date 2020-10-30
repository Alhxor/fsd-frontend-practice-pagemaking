/**
 * Idea from https://medium.com/@adityaa803/components-in-javascript-1f5c66042fa5
 */

const Store = {};

/**
 * Add a listener callback to event (subscribe to it from a component)
 * @param {string} id Unique id of the event, e.g. "MyForm/submit"
 * @param {function(payload)} listener Callback to execute when event triggers
 * @returns {undefined}
 */
export function subscribe(id, listener) {
  if (!id || typeof id !== "string" || typeof listener !== "function") return;
  if (!Store.hasOwnProperty(id)) Store[id] = [];
  Store[id].push(listener);
}

// export function unsubscribe(id, )

/**
 * Dispatch event from the component where it happens, call all listeners
 * @param {string} id Unique id of the event, e.g. "MyForm/submit"
 * @param {object} payload Data from the event, will be passed to listener callbacks
 * @returns {undefined}
 */
export function dispatch(id, payload = {}) {
  if (!id || typeof id !== "string" || !Store.hasOwnProperty(id)) return;
  for (let listener of Store[id]) listener(payload);
}
