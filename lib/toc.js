/**
 * Module dependencies.
 */

const Stack = require('./stack')

/**
 * Expose a object containing the utilities of TOC.
 */
module.exports = {
  getSidebarByToc
}

/**
 * Transform yuque's toc to vuepress's sidebar config.
 *
 * @param {Array<TocNode>>} toc
 * @returns {Array<SidebarGroup>}
 */

function getSidebarByToc(toc) {
  const stack = new Stack()
  const sidebar = []
  stack.push({
    children: sidebar
  })

  for (let i = 0, l = toc.length; i < l; i++) {
    const prev = toc[i - 1]
    const cur = toc[i]
    const next = toc[i + 1]

    if (!prev) {
      if (next.depth >= cur.depth) {
        pushBranch(cur, stack)
      } else {
        pushLeaf(cur, stack)
      }

    } else if (!next) {
      if (cur.depth >= prev.depth) {
        pushLeaf(cur, stack)
      } else {
        stack.pop()
        if (cur.depth === 1) {
          pushBranch(cur, stack)
        } else {
          pushLeaf(cur, stack)
        }
      }

    } else {
      // Current node is the children node of previous node
      if (cur.depth > prev.depth) {
        // Current node is a branch node
        if (next.depth > cur.depth) {
          pushBranch(cur, stack)
          // Current node is a leaf node
        } else {
          pushLeaf(cur, stack)
        }
        // Current node is the adjacent node of previous node
      } else if (cur.depth === prev.depth) {
        // Current node is a branch node adjacent to the previous node
        if (next.depth > cur.depth) {
          stack.pop()
          pushBranch(cur, stack)
          // Current node is a leaf node adjacent to the previous node
        } else {
          pushLeaf(cur, stack)
        }
        // Current node is adjacent node previous node's parnent's node
      } else if (cur.depth < prev.depth) {
        if (next.depth > cur.depth) {
          stack.pop()
          pushBranch(cur, stack)
        } else {
          stack.pop()
          pushLeaf(cur, stack)
        }
      }
    }
  }
  return sidebar
}

/**
 * Push branch node
 *
 * @param {TocNode} node
 * @param {Stack} stack
 */

function pushBranch(node, stack) {
  const group = getBranch(node)
  stack.peek().children.push(group)
  stack.push(group)
}

/**
 * Push leaf node
 *
 * @param {TocNode} node
 * @param {Stack} stack
 */

function pushLeaf(node, stack) {
  stack.peek().children.push(getLeaf(node))
}

/**
 * Get leaf node for vuepress's sidebar group
 *
 * @param {string} title
 * @param {string} slug
 * @returns {Array<string>}
 */

function getLeaf({
  title,
  slug
}) {
  return [`/${slug}/`, title]
}

/**
 * Get branch node for vuepress's sidebar group
 *
 * @param {string} title
 * @param {string} slug
 * @returns {SidebarGroup}
 */

function getBranch({
  title,
  slug
}) {
  const group = {
    title,
    collapsable: false,
    children: []
  }
  if (slug && slug !== '#') {
    group.path = `/${slug}/`
  }
  return group
}

