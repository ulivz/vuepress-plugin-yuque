const assert = require('assert')
const url = require('url')
const wfetch = require('./fetch')
const store = require('./store')
const { hash, logger, chalk } = require('@vuepress/shared-utils')
const { PACKAGE_NAME } = require('./constant')
const debug = require('debug')(`${PACKAGE_NAME}:yuque`)

const AUTH_TOKEN = process.env.YUQUE_QUTH_TOKEN
const SKIP_CACHE = process.env.SKIP_CACHE
const isProduction = process.env.NODE_ENV === 'production'

let instance
let repoId

module.exports = class Yuque {
  static setRepoId(id) {
    repoId = id
  }

  static getInstance() {
    if (!instance) {
      instance = new Yuque(repoId)
    }
    return instance
  }

  static async fetch(url, options = {}) {
    debug('fetch', url, 'with', JSON.stringify(options, null, 2))
    const { useCache = true } = options
    const key = hash(url + JSON.stringify(options))
    const cacheKey = `fetch.${key}`
    let yuque

    if (!isProduction && repoId && useCache && !SKIP_CACHE) {
      yuque = Yuque.getInstance()
      const cached = yuque.store.get(cacheKey)
      if (cached) {
        debug(`Using cache for ${chalk.yellow(url)}`)
        return cached
      }
    }

    let response
    const foptions = {}
    if (AUTH_TOKEN) {
      foptions.headers = {
        'X-Auth-Token': AUTH_TOKEN
      }
    }

    try {
      response = await wfetch(url, foptions)
      yuque && yuque.store.set(cacheKey, response)
      return response
    } catch (e) {
      return e
    }
  }

  static async get(base, path) {
    path = `${base}${path}`
    return Yuque.fetch(path)
  }

  static async getRepos(base, repoId) {
    return Yuque.get(base, `groups/${repoId}/repos`)
  }

  static async getRepoDetail(base, repoId) {
    return Yuque.get(base, `repos/${repoId}`)
  }

  static async getToc(base, repoId) {
    return this.get(base, `repos/${repoId}/toc`)
  }

  static async getPage(base, repoId, slug) {
    return this.get(base, `repos/${repoId}/docs/${slug}?raw=1`)
  }

  static async inferRepoByUrl(repoUrl) {
    const { protocol, host, pathname } = url.parse(repoUrl)
    assert(
      typeof pathname === 'string',
      `[CANNOT_RESOLVE_PATHNAME] Cannot infer repoId from repoUrl: ${repoUrl}`
    )

    const normalizedPathname = pathname.replace(/(^\/|\/$)/g, '')
    const [groupId, repoId] = normalizedPathname.split('/')
    assert(
      typeof groupId === 'string' &&
      typeof repoId === 'string',
      `[CANNOT_PARSE_PATHNAME] Cannot infer repoId from repoUrl: ${repoUrl}`
    )

    const base = `${protocol}//${host}/api/v2/`
    const { data: repos } = await Yuque.getRepos(base, groupId)
    assert(
      Array.isArray(repos),
      `[CANNOT_FIND_GROUP] Cannot infer repoId from repoUrl: ${repoUrl}`
    )

    const targetRepo = repos.find(repo => repo.namespace === normalizedPathname)
    assert(
      typeof targetRepo === 'object',
      `[CANNOT_FIND_REPO] Cannot infer repoId from repoUrl: ${repoUrl}`
    )

    return targetRepo
  }

  constructor(repoId) {
    this.base = 'https://www.yuque.com/api/v2/'
    this.repoId = repoId
    this.store = store.get(`yuque_repo_${repoId}`)
  }

  async getRepos() {
    return Yuque.getRepos(this.base, this.repoId)
  }

  async getRepoDetail() {
    return Yuque.getRepoDetail(this.base, this.repoId)
  }

  async getToc() {
    return Yuque.getToc(this.base, this.repoId)
  }

  async getPage(slug) {
    return Yuque.getPage(this.base, this.repoId, slug)
  }
}
