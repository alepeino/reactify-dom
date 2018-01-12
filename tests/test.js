import { JSDOM } from 'jsdom'
import ReactifyDOM, { registerComponent } from '../src'
import { expectDomToContain } from './helpers'
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
    const dom = new JSDOM(`<html><head></head><body><h1>Title</h1><test-component-1>Unknown HTML Element</test-component-1></body></html>`)

    ReactifyDOM.render(dom.window.document.body)

    expectDomToContain(dom, 'test-component-1', node =>
      expect(node.innerHTML).toEqual('Unknown HTML Element'),
      1
    )
  })

  test('registered components render as React elements', () => {
    const dom = new JSDOM(`<html>
      <head></head>
      <body>
        <h1>Title</h1>
        <test-component-1>Unknown HTML Element</test-component-1>
        <test-component-2></test-component-2>
      </body>
    </html>`)

    ReactifyDOM.registerComponent(TestComponent1)
      .registerComponent(TestComponent2)
      .render(dom.window.document.body)

    expectDomToContain(dom, 'test-component-1', node => {
      expect(node.innerHTML).not.toContain('Unknown HTML Element')
      expect(node.innerHTML).toEqual('<div>Test Component 1</div>')
    }, 1)

    expectDomToContain(dom, 'test-component-2', node =>
      expect(node.innerHTML).toEqual('<div><p>Test Component 2</p></div>'),
      1
    )
  })

  test('register components with custom selectors', () => {
    const dom = new JSDOM(`<html>
      <head></head>
      <body>
        <h1>Title</h1>
        <div id="container">
          <div id="test-component"></div>
          <div class="test-component-2"></div>
          <div class="test-component-2"></div>
        </div>
      </body>
    </html>`)

    ReactifyDOM.registerComponent(TestComponent1, '#test-component')
      .registerComponent(TestComponent2, '#container .test-component-2')
      .render(dom.window.document.body)

    expectDomToContain(dom, '#test-component', node =>
      expect(node.innerHTML).toEqual('<div>Test Component 1</div>'),
      1
    )

    expectDomToContain(dom, '#container .test-component-2', node =>
      expect(node.innerHTML).toEqual('<div><p>Test Component 2</p></div>'),
      2
    )
  })
})

describe('rendering edge-cases', () => {

  test('yields identical DOM when no components mounted', () => {
    const html = `<html><head></head><body><h1>Title</h1><div>Body</div></body></html>`
    const dom = new JSDOM(html)

    ReactifyDOM.render(dom.window.document.body)

    expect(dom.serialize()).toEqual(html)
  })
})
