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
