const Conf = require('conf')

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

module.exports = {
  get,
  init
}
