import {
  __,
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

const ATTRIBUTE_NAME_REPLACE = {
  'for': 'htmlFor',
  'class': 'className',
  'readonly': 'readOnly'
}

const BOOLEAN_ATTRIBUTES = [
  'checked',
  'defer',
  'disabled',
  'ismap',
  'multiple',
  'noresize',
  'readonly',
  'selected'
]

const components = {}

function attributeName (attribute) {
  return get(attribute.localName, ATTRIBUTE_NAME_REPLACE) || attribute.localName
}

function attributeValue (attribute) {
  return BOOLEAN_ATTRIBUTES.includes(attribute.localName)
    ? attribute.nodeValue !== 'false'
    : attribute.nodeValue
}

function reactTree (node) {
  if (node.nodeType === NODE_TYPE.COMMENT) {
    return
  }

  if (node.nodeType === NODE_TYPE.TEXT) {
    return node.textContent
  }

  const element = flow(
    keys,
    find(selector => node.matches(selector)),
    get(__, components)
  )(components) || node.localName

  const props = flow(
    keyBy(attributeName),
    mapValues(attributeValue)
  )(node.attributes)

  return React.createElement(element, props, ...map(reactTree, node.childNodes))
}

const ReactifyDOM = {
  registerComponent(component, selector) {
    components[selector || component.name.toLowerCase()] = component
    return this
  },
  clearComponents() {
    flow(keys, each(k => delete components[k]))(components)
    return this
  },
  render(rootNode) {
    flow(
      keys,
      each(selector =>
        rootNode.querySelectorAll(selector)
          .forEach(node => ReactDOM.render(reactTree(node), node))
      )
    )(components)
  }
}

export function registerComponent (...args) {
  ReactifyDOM.registerComponent(...args)
  return components
}

export default ReactifyDOM
