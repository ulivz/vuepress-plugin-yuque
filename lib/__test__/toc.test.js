const { getSidebarByToc } = require('../toc')
const tocs = require('./toc.constant')

test('getSidebarByToc', () => {
  tocs.forEach(toc => {
    const sidebar = getSidebarByToc(toc)
    expect(sidebar).toMatchSnapshot()
  })
})
