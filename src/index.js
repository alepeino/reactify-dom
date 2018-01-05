import { kebabCase } from 'lodash/fp'
import React from 'react'
import ReactDOM from 'react-dom'

const components = {}

export function registerComponent (component, selector) {
  components[selector || kebabCase(component.name)] = component
  return components
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
    Object.keys(components).forEach(componentName =>
        Array.from(rootNode.getElementsByTagName(componentName)).forEach(node =>
          ReactDOM.render(React.createElement(components[componentName]), node)
        )
    )
  }
}

export default ReactifyDOM
