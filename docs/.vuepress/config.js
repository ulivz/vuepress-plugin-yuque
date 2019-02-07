module.exports = {
  plugins: [
    [
      require('../../lib/index.js'),
      {
        html: true,
        repoUrl: 'https://www.yuque.com/vuepress/vuepress-plugin-yuque',
        home: {
          actionText: 'Getting Started →',
          actionLink: '/intro/',
          // heroImage: 'https://cdn.nlark.com/yuque/0/2018/png/84868/1535520500482-avatar/20c595c5-ab31-4543-9142-f36cc87c8868.png?x-oss-process=image/resize,m_fill,w_320,h_320',
          footer: `Copyright © ULIVZ`,
          // features: [
          //   { title: '循序渐进', details: '本教程的难度依次递进，为阅读者呈现舒适的学习曲线' },
          //   { title: '值得信赖', details: '由 antd 团队亲自打造，从技术栈、生态、研发流程等来为你提供系统化的学习体验' },
          //   { title: '最佳实践', details: '通过结合实际开发过程中的案例，来描述不同场景下的最佳实践' },
          // ]
        }
      }
    ]
  ]
}
