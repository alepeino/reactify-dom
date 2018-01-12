import { JSDOM } from 'jsdom'
import ReactifyDOM, { registerComponent } from '../src'
import {
  TestComponent1,
  TestComponent2
} from './stubs'

beforeEach(ReactifyDOM.clearComponents)

describe('component registration', () => {

  test('registers with default name in kebab case', () => {
    expect(registerComponent(TestComponent1))
      .toEqual({ 'test-component-1': TestComponent1 })
    expect(registerComponent(TestComponent2))
      .toEqual({ 'test-component-1': TestComponent1, 'test-component-2': TestComponent2 })
  })

  test('registers with custom selector', () => {
    expect(registerComponent(TestComponent1, 'my-component'))
      .toEqual({ 'my-component': TestComponent1 })
    expect(registerComponent(TestComponent2, '.component-2'))
      .toEqual({ 'my-component': TestComponent1, '.component-2': TestComponent2 })
  })

})

describe('rendering to DOM', () => {

  test('yields identical DOM when no components mounted', () => {
    const html = `<html><head></head><body><h1>Title</h1><div>Body</div></body></html>`
    const dom = new JSDOM(html)
    ReactifyDOM.render(dom.window.document.body)

    expect(dom.serialize()).toEqual(html)
  })

  test('unregistered component renders as unknown element', () => {
    const html = `<html><head></head><body><h1>Title</h1><test-component-1>Unknown HTML Element</test-component-1></body></html>`
    const dom = new JSDOM(html)
    ReactifyDOM.render(dom.window.document.body)

    expect(dom.window.document.querySelector('test-component-1').innerHTML).toEqual('Unknown HTML Element')
  })

  test('registered components render as React elements', () => {
    const html = `<html>
      <head></head>
      <body>
        <h1>Title</h1>
        <test-component-1>Unknown HTML Element</test-component-1>
        <test-component-2></test-component-2>
      </body>
    </html>`
    const dom = new JSDOM(html)
    ReactifyDOM.registerComponent(TestComponent1)
      .registerComponent(TestComponent2)
      .render(dom.window.document.body)

    expect(dom.window.document.querySelector('test-component-1').innerHTML).not.toContain('Unknown HTML Element')
    expect(dom.window.document.querySelector('test-component-1').innerHTML).toEqual('<div>Test Component 1</div>')
    expect(dom.window.document.querySelector('test-component-2').innerHTML).toEqual('<div><p>Test Component 2</p></div>')
  })
})
