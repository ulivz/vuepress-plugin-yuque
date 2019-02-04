const wfetch = require('./fetch')
const store = require('./store')
const { hash, logger, chalk } = require('@vuepress/shared-utils')
const Yuque = require('./yuque')

let instance
let repoId

module.exports = class Yuque {
  static setRepoId(id) {
    repoId = id
  }

  static getInstance() {
    if (instance) {
      return instance
    }
    return new Yuque(repoId)
  }

  static async fetch(url, options = {}) {
    const { useCache = true } = options
    const yuque = Yuque.getInstance()
    const { store } = yuque
    const key = hash(url + JSON.stringify(options))
    const cacheKey = `fetch.${key}`

    if (useCache && store.get(cacheKey)) {
      logger.debug(`Using cache for ${chalk.yellow(url)}`)
      return store.get(cacheKey)
    }

    let response
    try {
      response = await wfetch(url, options)
      store.set(cacheKey, response)
      return response
    } catch (e) {
      return e
    }
  }

  constructor(repoId) {
    this.base = 'https://www.yuque.com/api/v2/'
    this.repoId = repoId
    this.store = store.get(`yuque_repo_${repoId}`)
  }

  get(path) {
    path = `${this.base}${path}`
    return Yuque.fetch(path)
  }

  async getRepoDetail() {
    return this.get(`repos/${this.repoId}`)
  }

  async getToc() {
    return this.get(`repos/${this.repoId}/toc`)
  }

  async getPage(slug) {
    return this.get(`repos/${this.repoId}/docs/${slug}?raw=1`)
  }
}
