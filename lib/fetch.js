/**
 * Module dependencies.
 */

const fetch = require('node-fetch')

/**
 * Expose a wrapped fetch which handles network error.
 */

module.exports = function (url, options = {}) {
  return fetch(url, options)
    .then(handleResponse, handleNetworkError)
}

/**
 * Response handler
 *
 * @param {Response} response
 * @returns {Promise<any>>|never}
 */

function handleResponse(response) {
  if (response.ok) {
    return response.json()
  }
  return response.json().then(error => {
    throw error
  })
}

/**
 * Network error handler
 *
 * @param {Error} error
 */

function handleNetworkError(error) {
  throw {
    msg: error.message
  }
}
