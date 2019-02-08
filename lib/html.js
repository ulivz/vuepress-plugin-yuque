/**
 * Module dependencies.
 */

const cheerio = require('cheerio')
const compose = require('./compose')

/**
 * Expose a object containing the utilities of handling markups.
 */

module.exports = {
  prettify
}

const transformHeaders = compose(
  ...[
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
  ].map((h, i) => $ => {
      $(h).replaceWith((_i, el) => {
        return `\n\n ${getHash(i + 1)} ${$(el).text()} \n\n`
      })
      return $
    }
  )
)

function getHash(i) {
  return [...Array(i)].map(() => '#').join('')
}

function prettify(html) {
  html = prune(html)
  const $ = cheerio.load(html, {
    // ref: https://github.com/cheeriojs/cheerio/issues/565
    decodeEntities: false
  })
  transformHeaders($)
  return $('body').html()
}

function prune(html) {
  return html
    .replace(/<p><br\s\/><\/p>/g, '')
    .replace(/<p><span><br\s\/><\/span><\/p>/g, '')
}
