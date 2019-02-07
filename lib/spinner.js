/**
 * Module dependencies.
 */

const ora = require('ora')
const { chalk } = require('@vuepress/shared-utils')

/**
 * Expose a singleton of spinner
 */

module.exports = !process.env.DEBUG
  ? ora()
  : [
    'frame',
    'clear',
    'render',
    'start',
    'stop',
    'succeed',
    'fail',
    'warn',
    'info',
    'stopAndPersist'
  ].reduce((memo, key) => {
    memo[key] = curry(key)
    return memo
  }, {})

function curry(name) {
  return (...args) => console.log(chalk.cyan(`spinner:${name}`), ...args)
}
