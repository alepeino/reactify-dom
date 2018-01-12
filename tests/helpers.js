export const expectDomToContain = ({ window: { document }}, selector, assertions, length) => {
  const nodeList = document.body.querySelectorAll(selector)

  if (length) expect(nodeList.length).toEqual(length)

  nodeList.forEach(node => {
    assertions(node)
    expect(document.contains(node)).toBe(true)
  })
}
