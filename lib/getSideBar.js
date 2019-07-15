/**
 * Module dependencies.
 */

// const Stack = require('./stack');

/**
 * Expose a object containing the utilities of TOC.
 */
module.exports = {
  getSidebarByToc,
};

/**
 * Transform yuque's toc to vuepress's sidebar config.
 *
 * @param {Array<TocNode>>} toc
 * @returns {Array<SidebarGroup>}
 */

function getSidebarByToc(toc, baseRoute) {
  const stack = [];

  if (!Array.isArray(toc)) {
    throw new Error('toc must be an array!');
  }

  function makeNode(arrayItem) {
    return {
      title: arrayItem.title,
      path: arrayItem.slug !== '#' ? `${baseRoute || ''}/${arrayItem.slug}.html` : undefined,
      children: [],
      collapsable: false,
    };
  }

  const sideBar = [];

  for (let i = 0; i < toc.length; i++) {
    const prev = toc[i - 1];
    const cur = toc[i];
    const next = toc[i + 1];
    const curNode = makeNode(cur);
    // pop the stack if the cur depth is smaller
    if (prev && cur.depth < prev.depth) {
      let diff = prev.depth - cur.depth;
      while (diff--) {
        stack.pop();
      }
    }

    // get the top of stack;
    const topNode = stack[stack.length - 1];

    // add the node accordingly
    if (topNode) {
      topNode.children.push(curNode);
    } else {
      sideBar.push(curNode);
    }

    // see if current node has children
    // see if the current node should push into stack
    if (next && next.depth > cur.depth) {
      stack.push(curNode);
    }
  }

  return sideBar;
}
