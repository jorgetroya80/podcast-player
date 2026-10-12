import { escapeAttribute, escapeHtml } from './escapeHtml'

describe('escapeHtml', () => {
  it('escapes ampersands, less-than and greater-than', () => {
    expect(escapeHtml('Q&A <b> a > b')).toBe('Q&amp;A &lt;b&gt; a &gt; b')
  })

  it('escapes the ampersand first so entities are not double-decoded', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;')
  })

  it('leaves quotes and plain text alone', () => {
    expect(escapeHtml(`it's "fine"`)).toBe(`it's "fine"`)
    expect(escapeHtml('')).toBe('')
  })
})

describe('escapeAttribute', () => {
  it('also escapes double and single quotes', () => {
    expect(escapeAttribute(`a"b'c&d<e>`)).toBe('a&quot;b&#39;c&amp;d&lt;e&gt;')
  })
})
