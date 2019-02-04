module.exports = {
  getSidebarByToc
}

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
        pushLeaf(cur, stack)
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

function pushBranch(cur, stack) {
  const group = getBranch(cur)
  stack.peek().children.push(group)
  stack.push(group)
}

function pushLeaf(cur, stack) {
  stack.peek().children.push(getLeaf(cur))
}

function getLeaf({
  title,
  slug
}) {
  return [`/${slug}/`, title]
}

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

class Stack {
  constructor() {
    this.elements = []
  }

  push(element) {
    this.elements.push(element)
  }

  pop() {
    return this.elements.pop()
  }

  peek() {
    return this.elements[this.elements.length - 1]
  }
}
