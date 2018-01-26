import { JSDOM } from 'jsdom'
import { expectDomToContain } from './helpers'
import ReactifyDOM, { registerComponent } from '../src'
import {
  LiComponent,
  TestComponent1,
  TestComponent2,
  UlComponent
} from './stubs'

beforeEach(ReactifyDOM.clearComponents)

describe('component registration', () => {

  test('registers with default name in lower case', () => {
    expect(registerComponent(TestComponent1))
      .toEqual({ 'testcomponent1': TestComponent1 })
    expect(registerComponent(TestComponent2))
      .toEqual({ 'testcomponent1': TestComponent1, 'testcomponent2': TestComponent2 })
  })

  test('registers with custom selector', () => {
    expect(registerComponent(TestComponent1, 'my-component'))
      .toEqual({ 'my-component': TestComponent1 })
    expect(registerComponent(TestComponent2, '.component-2'))
      .toEqual({ 'my-component': TestComponent1, '.component-2': TestComponent2 })
  })

})

describe('rendering components', () => {

  test('unregistered component renders as unknown element', () => {
    const dom = new JSDOM(`<html><head></head><body><h1>Title</h1><TestComponent1>Unknown HTML Element</TestComponent1></body></html>`)

    ReactifyDOM.render(dom.window.document.body)

    expectDomToContain(dom, 'TestComponent1', node =>
      expect(node.innerHTML).toEqual('Unknown HTML Element'),
      1
    )
  })

  test('registered components render as React elements', () => {
    const dom = new JSDOM(`<html>
      <head></head>
      <body>
        <h1>Title</h1>
        <TestComponent1>Unknown HTML Element</TestComponent1>
        <TestComponent2></TestComponent2>
      </body>
    </html>`)

    ReactifyDOM.registerComponent(TestComponent1)
      .registerComponent(TestComponent2)
      .render(dom.window.document.body)

    expectDomToContain(dom, 'TestComponent1', node => {
      expect(node.innerHTML).not.toContain('Unknown HTML Element')
      expect(node.innerHTML).toEqual('<div>Test Component 1</div>')
    }, 1)

    expectDomToContain(dom, 'TestComponent2', node =>
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

  describe('render components with children', () => {
    test('children are registered components', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <UlComponent><TestComponent1></TestComponent1><TestComponent1></TestComponent1></UlComponent>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(UlComponent)
        .registerComponent(TestComponent1)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'UlComponent > *', node => {
        expect(node.tagName).toEqual('UL')
      }, 1)
      expectDomToContain(dom, 'UlComponent > * > *', node => {
        expect(node.tagName).toEqual('DIV')
        expect(node.innerHTML).toEqual('Test Component 1')
      }, 2)
    })

    test('children are standard HTML tags', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <UlComponent>
              <li>HTML tag as child</li>
              <li>HTML tag as child</li>
            </UlComponent>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(UlComponent)
        .registerComponent(TestComponent1)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'UlComponent > *', node => {
        expect(node.tagName).toEqual('UL')
      }, 1)
      expectDomToContain(dom, 'UlComponent > * > *', node => {
        expect(node.tagName).toEqual('LI')
        expect(node.textContent).toEqual('HTML tag as child')
      }, 2)
    })

    test('children include text nodes', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <UlComponent>
              Text Node 1
              <TestComponent1></TestComponent1>
              Text Node 2
            </UlComponent>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(UlComponent)
        .registerComponent(TestComponent1)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'UlComponent', node => {
        expect(node.innerHTML).toContain('Text Node 1')
        expect(node.innerHTML).toContain('Text Node 2')
      })
    })

    test('comment nodes are removed from children', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <UlComponent>
              <!--Comment node 1-->
              <TestComponent1></TestComponent1>
              <!--Comment node 2-->
            </UlComponent>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(UlComponent)
        .registerComponent(TestComponent1)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'UlComponent', node => {
        expect(node.innerHTML).not.toContain('Comment Node 1')
        expect(node.innerHTML).not.toContain('Comment Node 2')
      })
    })
  })

  describe('render components with props', () => {
    test('props are passed to children', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <ul>
              <LiComponent text="li component 0"></LiComponent>
              <LiComponent text="li component 1"></LiComponent>
              <LiComponent text="li component 2"></LiComponent>
            </ul>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(LiComponent)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'LiComponent > *', (node, index) => {
        expect(node.tagName).toEqual('LI')
        expect(node.textContent).toEqual(`li component ${index}`)
      }, 3)
    })

    test('standard HTML tags support attributes as props', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <UlComponent>
              <li title="li element 0">Item 0</li>
              <li title="li element 1">Item 1</li>
            </UlComponent>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(UlComponent)
        .registerComponent(TestComponent1)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'UlComponent > * > *', (node, index) => {
        expect(node.tagName).toEqual('LI')
        expect(node.getAttribute('title')).toEqual(`li element ${index}`)
        expect(node.textContent).toEqual(`Item ${index}`)
      }, 2)
    })

    test('JSX attributes special cases', () => {
      const dom = new JSDOM(`<html>
        <head></head>
        <body>
            <UlComponent>
              <li class="red">
                <label for="remember">Remember me</label>
                <input id="remember" type="checkbox" checked="false" disabled readonly />
              </li>
            </UlComponent>
        </body>
      </html>`)

      ReactifyDOM.registerComponent(UlComponent)
        .render(dom.window.document.body)

      expectDomToContain(dom, 'UlComponent > * > *', (node, index) => {
        expect(node.tagName).toEqual('LI')
        expect(node.getAttribute('class')).toEqual('red')
        expect(node.querySelector('label').getAttribute('for')).toEqual('remember')
        expect(node.querySelector('input').checked).toBe(false)
        expect(node.querySelector('input').disabled).toBe(true)
        expect(node.querySelector('input').readOnly).toBe(true)
      }, 1)
    })
  })
})
