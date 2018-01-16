import {
  __,
  kebabCase,
  each,
  find,
  flow,
  get,
  keyBy,
  keys,
  map,
  mapValues
} from 'lodash/fp'
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

  return React.createElement(
    flow(keys, find(selector => node.matches(selector)), get(__, components))(components) || node.localName,
    flow(keyBy('localName'), mapValues('nodeValue'))(node.attributes),
    ...map(reactTree, node.childNodes)
  )
}

const ReactifyDOM = {
  registerComponent(component, selector) {
    components[selector || kebabCase(component.name)] = component
    return this
  },
  clearComponents() {
    flow(keys, each(k => delete components[k]))(components)
    return this
  },
  render (rootNode) {
    flow(
      keys,
      each(selector =>
        each(node => ReactDOM.render(reactTree(node), node), rootNode.querySelectorAll(selector))
      )
    )(components)
  }
}

export function registerComponent (...args) {
  ReactifyDOM.registerComponent(...args)
  return components
}

export default ReactifyDOM
