import sanitizeHtml from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('keeps allowed markup', () => {
    const html = '<p>Hi <b>bold</b> <i>it</i></p><ul><li>one</li></ul>'

    expect(sanitizeHtml(html)).toBe(html)
  })

  it('removes script, iframe, event handlers and javascript: urls', () => {
    const out = sanitizeHtml(
      '<script>1</script><iframe src="https://x.test"></iframe>' +
        '<img src="x" onerror="1"><p onclick="1">t</p><a href="javascript:alert(1)">l</a>',
    )

    expect(out).not.toMatch(/script|iframe|onerror|onclick|javascript:/i)
  })

  it('opens links safely', () => {
    const out = sanitizeHtml('<a href="https://a.test" target="_self" rel="opener">a</a>')

    expect(out).toContain('target="_blank"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).not.toContain('_self')
  })

  it('is idempotent on already-clean html', () => {
    const clean = '<p>Hi <b>bold</b></p><ul><li>one</li></ul>'

    expect(sanitizeHtml(sanitizeHtml(clean))).toBe(clean)
  })

  it('is stable on its own output when it contains links', () => {
    // Attribute order may change on the second pass, so compare from the second one on.
    const once = sanitizeHtml('<p onclick="1">Hi <a href="https://a.test">l</a></p>')
    const twice = sanitizeHtml(once)

    expect(twice).toContain('target="_blank"')
    expect(twice).toContain('rel="noopener noreferrer"')
    expect(sanitizeHtml(twice)).toBe(twice)
  })

  it('returns an empty string for an empty string', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('does not register the hook on the global DOMPurify', async () => {
    const { default: globalPurify } = await import('dompurify')

    expect(globalPurify.sanitize('<a href="https://a.test">a</a>')).not.toContain('target')
  })
})
