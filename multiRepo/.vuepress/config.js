module.exports = {
  head: [
    ['link', { rel: 'icon', href: `https://cdn.nlark.com/yuque/0/2019/png/242808/1549571925285-2372b0a0-0234-421c-a139-00ea16f1a106.png` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    repo: 'ulivz/vuepress-plugin-yuque',
    nav: [
      { text: 'Doc A', link: '/a/1-1-1' },
      { text: 'Doc B', link: '/b/b1' },
      { text: 'CHANGELOG', link: '/changelog.html' },
    ]
  },
  async additionalPages () {
    const fetch = require('node-fetch')
    const response = await fetch('https://raw.githubusercontent.com/ulivz/vuepress-plugin-yuque/master/CHANGELOG.md')
    const content = await response.text()
    return [
      {
        path: '/changelog.html',
        content
      }
    ]
  },
  plugins: [
    [
      require('../../lib'),
      {
        html: true,
        yuqueLink: true,
        /**
         * new option: multiRepoUrls
         * @property {string} repoRoute - route for the indivial repo, must given. doesn't support '/'
         * @property {string} repoUrl - the url of the repo
         */
        multiRepoUrls: [
          {
            repoRoute: 'a',
            repoUrl: 'https://www.yuque.com/zhoufan-jaod3/kb',
          },
          {
            repoRoute: 'b',
            repoUrl: 'https://www.yuque.com/zhoufan-jaod3/cd1bqa',
          },
        ],
        home: {
          actionText: 'Getting Started →',
          actionLink: '/intro.html',
          heroImage: 'https://cdn.nlark.com/yuque/0/2019/png/242808/1549571925285-2372b0a0-0234-421c-a139-00ea16f1a106.png',
          footer: `Copyright © ULIVZ`,
          features: [
            { title: '简单', details: 'Zero-Markdown，只需配置你的语雀 repo 地址，就能获得一个 VuePress 站点' },
            { title: '高效', details: '自动生成的文档主页、侧边栏让你享受 “高效” 的文档生成体验' },
            { title: '缓存', details: '完美地解决语雀 Open API 调用次数超限的问题' },
          ]
        }
      }
    ]
  ]
}
