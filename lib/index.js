/**
 * Module dependencies.
 */

const assert = require('assert')
const { chalk, parseFrontmatter, path } = require('@vuepress/shared-utils')
const Yuque = require('./yuque')
// const { getSidebarByToc } = require('./toc');
const { getSidebarByToc } = require('./getSideBar')
const spinner = require('./spinner')
const { prettify } = require('./html')
const { PACKAGE_NAME } = require('./constant')
const debug = require('debug')(PACKAGE_NAME)

/**
 * Expose vuepress-plugin-yuque
 */

module.exports = (opts, ctx) => {
  return {
    name: PACKAGE_NAME,

    enhanceAppFiles: [path.join(__dirname, 'client.js')],

    plugins: [['@vuepress/medium-zoom', true]],

    chainMarkdown(config) {
      if (opts.html) {
        return
      }
      // Disable `html` for now. Many yuque writers would write raw HTML in the markdown
      // But only these markups under inline code(`) will be transpiled successfully when
      // `html` is enabled.
      config.options.html(false)
    },

    async ready() {
      let { repoId, repoUrl, authToken, source, multiRepoUrls } = opts

      if (repoId) {
        assert(
          typeof repoId === 'string' || typeof repoId === 'number',
          `[${PACKAGE_NAME}] repoId should be string or number, but got ${repoId}`
        )
      } else if (repoUrl) {
        assert(
          typeof repoUrl === 'string',
          `[${PACKAGE_NAME}] repoUrl should be string, but got ${repoId}`
        )
      } else if (multiRepoUrls) {
        assert(Array.isArray(multiRepoUrls), 'multiRepoUrls must be array')
        multiRepoUrls.forEach(repo => {
          assert(typeof repo === 'object', `[${PACKAGE_NAME}] multiRepoUrls must be object`)
          assert('repoRoute' in repo, `[${PACKAGE_NAME}] must have repoRoute for multiRepoUrls`)
        })
      } else {
        throw new Error(`Expected repoId or repoUrl`)
      }

      Yuque.setAuthToken(authToken)

      let repoIdArray = []
      if (multiRepoUrls && Array.isArray(multiRepoUrls)) {
        for (const { repoUrl, repoRoute } of multiRepoUrls) {
          const targetRepo = await Yuque.inferRepoByUrl(repoUrl)
          repoId = targetRepo.id
          repoIdArray.push({ repoId, repoUrl, repoRoute })
        }
      } else {
        if (repoUrl) {
          const targetRepo = await Yuque.inferRepoByUrl(repoUrl)
          repoId = targetRepo.id
        }
        repoIdArray.push({ repoId, repoUrl /*  repoRoute: 'default' */ })
      }

      let singleUser = {}

      for (let i = 0; i < repoIdArray.length; i++) {
        const { repoId, repoUrl, repoRoute } = repoIdArray[i]
        spinner.succeed(chalk.yellow(`Fetching for ${repoUrl}`))
        Yuque.setRepoId(repoId)
        const yuque = Yuque.getInstance()

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
        if (repoIdArray.length === 1) {
          singleUser = user
        }
        spinner.succeed(
          `Your Yuque website: ${chalk.green(name)} ` + `${chalk.gray(description)} ...`
        )
        spinner.start(`Fetching TOC ... `)

        const toc = await yuque.getToc()
        assert(toc && toc.data, `[${PACKAGE_NAME}] cannot get toc of ${repoId}`)

        debug('toc', toc.data)

        spinner.succeed(`Retrieved TOC`)

        // Apply sidebar config
        ctx.siteConfig.themeConfig = ctx.siteConfig.themeConfig || {}
        if (!ctx.siteConfig.title) {
          ctx.siteConfig.title = name
        }
        if (!ctx.siteConfig.description) {
          ctx.siteConfig.description = description
        }

        const directory = getSidebarByToc(toc.data, repoRoute && `/${repoRoute}`)
        if (!ctx.siteConfig.themeConfig.sidebar) {
          ctx.siteConfig.themeConfig.sidebar = {}
        }

        if (repoRoute) {
          ctx.siteConfig.themeConfig.sidebar[`/${repoRoute}/`] = directory
        } else {
          ctx.siteConfig.themeConfig.sidebar = directory
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

          const { status, data } = await yuque.getPage(slug)
          debug('status = ', status)

          let postContent
          if (status && status === 404) {
            postContent = `# ${title}\n > 此文档尚未创建`
          } else {
            const useMarkdown =
              typeof source === 'string'
                ? source === 'markdown'
                : typeof source === 'function'
                ? source(page) === 'markdown'
                : false
            if (useMarkdown || data.format === 'markdown' || data.format === 'lake') {
              postContent = data.body || ''
            } else {
              postContent = prettify(data.body_html || '')
            }
          }

          const { data: frontmatter, content: strippedContent } = parseFrontmatter(postContent)
          const inferredTitle = inferTitle({}, strippedContent)

          let content = inferredTitle ? postContent : `# ${title} \n\n ${postContent}`

          if (opts.yuqueLink) {
            content +=
              opts.yuqueLinkHtml ||
              `<br><br><a class="yuque-link" target="_blank" href="${repoUrl}/${slug}"><svg viewBox="64 64 896 896" class="" data-icon="yuque" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M854.6 370.6c-9.9-39.4 9.9-102.2 73.4-124.4l-67.9-3.6s-25.7-90-143.6-98c-117.8-8.1-194.9-3-195-3 .1 0 87.4 55.6 52.4 154.7-25.6 52.5-65.8 95.6-108.8 144.7-1.3 1.3-2.5 2.6-3.5 3.7C319.4 605 96 860 96 860c245.9 64.4 410.7-6.3 508.2-91.1 20.5-.2 35.9-.3 46.3-.3 135.8 0 250.6-117.6 245.9-248.4-3.2-89.9-31.9-110.2-41.8-149.6zm-204.1 334c-10.6 0-26.2.1-46.8.3l-23.6.2-17.8 15.5c-47.1 41-104.4 71.5-171.4 87.6-52.5 12.6-110 16.2-172.7 9.6 18-20.5 36.5-41.6 55.4-63.1 92-104.6 173.8-197.5 236.9-268.5l1.4-1.4 1.3-1.5c4.1-4.6 20.6-23.3 24.7-28.1 9.7-11.1 17.3-19.9 24.5-28.6 30.7-36.7 52.2-67.8 69-102.2l1.6-3.3 1.2-3.4c13.7-38.8 15.4-76.9 6.2-112.8 22.5.7 46.5 1.9 71.7 3.6 33.3 2.3 55.5 12.9 71.1 29.2 5.8 6 10.2 12.5 13.4 18.7 1 2 1.7 3.6 2.3 5l5 17.7c-15.7 34.5-19.9 73.3-11.4 107.2 3 11.8 6.9 22.4 12.3 34.4 2.1 4.7 9.5 20.1 11 23.3 10.3 22.7 15.4 43 16.7 78.7 3.3 94.6-82.7 181.9-182 181.9z"></path></svg> 使用语雀查看</a>`
          }

          const permalink = (repoRoute && `/${repoRoute}/${slug}.html`) || `/${slug}.html`

          await ctx.addPage({
            content,
            frontmatter,
            permalink,
          })

          if (!defaultActionLink) {
            defaultActionLink = permalink
          }

          spinner.succeed(`Retrieved ${chalk.cyan(title)} ... `)
        }
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
            heroImage: heroImage || singleUser.large_avatar_url,
            actionText: actionText || 'Getting Started →',
            actionLink: actionLink || defaultActionLink,
            features: features || undefined,
            footer: footer || `Copyright © ${singleUser.name}`,
          },
        })
      }
    },
  }
}

/**
 * Infer title, forked from VuePress.
 */
function inferTitle(frontmatter, strippedContent) {
  if (frontmatter.home) {
    return 'Home'
  }
  if (frontmatter.title) {
    return frontmatter.title
  }
  const match = strippedContent.trim().match(/^#\s+(.*)/)
  if (match) {
    return match[1]
  }
}
