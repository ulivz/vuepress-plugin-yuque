const fetch = require('node-fetch')

module.exports = function (url, options = {}) {
  return fetch(url, options)
    .then(handleResponse, handleNetworkError)
}

function handleResponse(response) {
  if (response.ok) {
    return response.json()
  }
  return response.json().then(error => {
    throw error
  })
}

function handleNetworkError(error) {
  throw {
    msg: error.message
  }
}
