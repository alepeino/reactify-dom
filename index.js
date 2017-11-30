const { get } = require('lodash/fp')
const React = require('react')
const ReactDOM = require('react-dom')
const originalRender = ReactDOM.render
const components = {}

const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8
}

const ATTRIBUTE_MAPPING = {
  'for': 'htmlFor',
  'class': 'className'
}

const ELEMENT_ATTRIBUTE_MAPPING = {
  'input': {
    'checked': 'defaultChecked',
    'value': 'defaultValue'
  }
}

function getElementType (element) {
  return get(element.localName, components) || element.localName
}

function getAttributeKey (element, attribute) {
  return get([element.localName, attribute.localName], ELEMENT_ATTRIBUTE_MAPPING)
      || get(attribute.localName, ATTRIBUTE_MAPPING)
      || attribute.localName
}

function getAttributeValue (element, attribute) {
  return element.localName in components ? eval(attribute.nodeValue) : attribute.nodeValue
}

function renderElement (e, i) {
  if (e.nodeType !== NODE_TYPE.ELEMENT) {
    return e.textContent
  }

  return React.createElement(
    getElementType(e),
    Array.from(e.attributes)
      .reduce((r, a) => {
        r[getAttributeKey(e, a)] = getAttributeValue(e, a)
        return r
      }, { key: i }),
    ...renderChildNodes(e)
  )
}

function renderChildNodes (element) {
  return Array.from(element.childNodes).map(renderElement)
}

function render (component, domNode) {
  return domNode
    ? originalRender(component, domNode)
    : (domNode = component) && originalRender(renderChildNodes(domNode), domNode)
}

function registerComponent (component, name) {
  components[name || component.name.toLowerCase()] = component
  return components
}

const ReactifyDOM = {
  render,
  registerComponent (...args) {
    registerComponent(...args)
    return this
  }
}

ReactDOM.render = ReactifyDOM.render

module.exports = ReactifyDOM
