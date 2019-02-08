module.exports = {
  title: 'Ant Design 实战教程',
  description: '基于 umi 的 Ant Design 实战教程',
  head: [
    ['link', {
      rel: 'icon',
      href: `https://cdn.nlark.com/yuque/0/2019/png/242808/1549571925285-2372b0a0-0234-421c-a139-00ea16f1a106.png`
    }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  plugins: [
    [
      require('../../lib'),
      {
        repoUrl: 'https://www.yuque.com/ant-design/course',
        home: {
          features: [
            { title: '循序渐进', details: '本教程的难度依次递进，为阅读者呈现舒适的学习曲线' },
            { title: '值得信赖', details: '由 antd 团队亲自打造，从技术栈、生态、研发流程等来为你提供系统化的学习体验' },
            { title: '最佳实践', details: '通过结合实际开发过程中的案例，来描述不同场景下的最佳实践' },
          ]
        }
      }
    ]
  ]
}
