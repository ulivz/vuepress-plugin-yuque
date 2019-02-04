/**
 * Module dependencies.
 */

const Conf = require('conf')

/**
 * Expose a object containing the utilities of cache.
 */

module.exports = {
  get,
  init
}

let store

function init(configName) {
  store = new Conf({
    configName: configName
  })
  return store
}

function get(configName) {
  if (store) {
    return store
  }
  return init(configName)
}


