export const expectDomToContain = ({ window: { document }}, selector, assertions, length) => {
  const nodeList = document.body.querySelectorAll(selector)

  if (length) expect(nodeList.length).toEqual(length)

  nodeList.forEach((node, index, list) => {
    assertions(node, index, list)
    expect(document.contains(node)).toBe(true)
  })
}
