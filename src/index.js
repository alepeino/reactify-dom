import { kebabCase } from 'lodash/fp'
import React from 'react'
import ReactDOM from 'react-dom'

const components = {}

function reactTree (node) {
  const element = components[Object.keys(components).find(selector => node.matches(selector))]
  return React.createElement(element)
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
