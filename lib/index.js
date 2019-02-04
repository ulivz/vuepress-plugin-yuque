/**
 * Module dependencies.
 */

const assert = require('assert')
const { chalk, parseFrontmatter, inferTitle } = require('@vuepress/shared-utils')
const Yuque = require('./yuque')
const { getSidebarByToc } = require('./toc')
const spinner = require('./spinner')
const pluginName = require('./../package').name

const debug = require('debug')(pluginName)

/**
 * Expose vuepress-plugin-yuque
 */

module.exports = (opts, ctx) => {
  const { repoId } = opts

  assert(
    typeof repoId === 'string' ||
    typeof repoId === 'number',
    `[${pluginName}] repoId should be string or number, but got ${repoId}`
  )

  Yuque.setRepoId(repoId)
  const yuque = Yuque.getInstance()

  return {
    name: pluginName,

    chainMarkdown(config) {
      // Disable `html` for now. Many yuque writers would write raw HTML in the markdown
      // But only these markups under inline code(`) will be transpiled successfully when
      // `html` is enabled.
      config
        .options
        .html(false)
    },

    async ready() {
      spinner.start(`Fetching repo detail ...`)
      const repoDetail = await yuque.getRepoDetail()
      if (!(repoDetail && repoDetail.data && repoDetail.data.name)) {
        spinner.fail(
          `Please check your repoId: ${chalk.yellow(repoId)} ` +
          `response: ${JSON.stringify(repoDetail)}`
        )
        process.exit(1)
      }
      spinner.succeed(`Retrieved repo detail`)

      const { name, description, user } = repoDetail.data
      spinner.succeed(
        `Your Yuque website: ${chalk.green(name)} ` +
        `${chalk.gray(description)} ...`
      )
      spinner.start(`Fetching TOC ... `)

      const toc = await yuque.getToc()
      assert(
        toc && toc.data,
        `[${pluginName}] cannot get toc of ${repoId}`
      )

      debug('toc', toc.data)

      spinner.succeed(`Retrieved TOC`)

      // Apply sidebar config
      const sidebar = getSidebarByToc(toc.data)
      ctx.siteConfig.themeConfig = ctx.siteConfig.themeConfig || {}
      ctx.siteConfig.themeConfig.sidebar = sidebar
      if (!ctx.siteConfig.title) {
        ctx.siteConfig.title = name
      }
      if (!ctx.siteConfig.description) {
        ctx.siteConfig.description = description
      }

      let defaultActionLink

      // Apply pages
      for (const page of toc.data) {
        const { title, slug } = page
        // Once the slug is equal to '#', it means that current node
        // is an empty node.
        if (!slug || slug === '#') {
          continue
        }

        spinner.start(`Fetching ${chalk.cyan(title)} ... `)

        const post = await yuque.getPage(slug)
        const postContent = post.data.body
        const {
          data: frontmatter,
          content: strippedContent
        } = parseFrontmatter(postContent)
        const inferredTitle = inferTitle({}, strippedContent)

        const content = inferredTitle
          ? postContent
          : `# ${title} \n ${postContent}`

        const permalink = `/${slug}/`
        await ctx.addPage({
          content,
          frontmatter,
          permalink
        })

        if (!defaultActionLink) {
          defaultActionLink = permalink
        }

        spinner.succeed(`Retrieved ${chalk.cyan(title)} ... `)
      }

      if (ctx.pages.every(page => page.path !== '/')) {
        const { home = {} } = opts
        const { actionText, actionLink, heroImage, features, footer } = home

        spinner.info(`Apply default homepage`)
        await ctx.addPage({
          content: '',
          permalink: '/',
          frontmatter: {
            home: true,
            heroImage: heroImage || user.large_avatar_url,
            actionText: actionText || 'Getting Started →',
            actionLink: actionLink || defaultActionLink,
            features: features || undefined,
            footer: footer || `Copyright © ${user.name}`,
          }
        })
      }
    }
  }
}
