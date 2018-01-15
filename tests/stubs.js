import React from 'react'

export function TestComponent1 (props) {
  return <div>Test Component 1</div>
}

export class TestComponent2 extends React.Component {
  render() {
    return (
      <div>
        <p>Test Component 2</p>
      </div>
    )
  }
}

export function UlComponent ({ children }) {
  return (
    <ul>
      {children}
    </ul>
  )
}

export function LiComponent ({ text }) {
  return (
    <li>{text}</li>
  )
}
