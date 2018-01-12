import { kebabCase } from 'lodash/fp'
import React from 'react'
import ReactDOM from 'react-dom'

const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8
}

const components = {}

function reactTree (node) {
  if (node.nodeType === NODE_TYPE.COMMENT) {
    return
  }

  if (node.nodeType === NODE_TYPE.TEXT) {
    return node.textContent
  }

  const element =
    components[Object.keys(components).find(selector => node.matches(selector))]
    || node.localName
  const children = Array.from(node.childNodes).map(reactTree)
  return React.createElement(element, {}, ...children)
}

const ReactifyDOM = {
  registerComponent(...args) {
    registerComponent(...args)
    return this
  },
  clearComponents() {
    Object.keys(components).forEach(k => delete components[k])
    return this
  },
  render (rootNode) {
    Object.keys(components).forEach(selector =>
        Array.from(rootNode.querySelectorAll(selector)).forEach(node =>
          ReactDOM.render(reactTree(node), node)
        )
    )
  }
}

export function registerComponent (component, selector) {
  components[selector || kebabCase(component.name)] = component
  return components
}

export default ReactifyDOM
