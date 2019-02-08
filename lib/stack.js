/**
 * Expose a simple stack
 */

module.exports = class Stack {
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
    return this.elements[this.size() - 1]
  }

  size() {
   return this.elements.length
  }
}
