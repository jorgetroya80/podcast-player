import plainTextToHtml from './plainTextToHtml'

describe('plainTextToHtml', () => {
  it('turns blank-line separated text into paragraphs', () => {
    expect(plainTextToHtml('First.\n\nSecond.')).toBe('<p>First.</p><p>Second.</p>')
  })

  it('collapses runs of blank lines into a single paragraph break', () => {
    expect(plainTextToHtml('A\n\n\n\nB\n\n\nC')).toBe('<p>A</p><p>B</p><p>C</p>')
    expect(plainTextToHtml('A\n \n\t\nB')).toBe('<p>A</p><p>B</p>')
  })

  it('keeps a single line break inside a paragraph as <br>', () => {
    expect(plainTextToHtml('Intro.\nFor more info, visit x.')).toBe(
      '<p>Intro.<br>For more info, visit x.</p>',
    )
  })

  it('normalizes Windows and old Mac line endings', () => {
    expect(plainTextToHtml('A\r\n\r\nB\rC')).toBe('<p>A</p><p>B<br>C</p>')
  })

  it('trims the text and ignores empty input', () => {
    expect(plainTextToHtml('\n\n  Hello  \n\n')).toBe('<p>Hello</p>')
    expect(plainTextToHtml('')).toBe('')
    expect(plainTextToHtml(' \n\n ')).toBe('')
  })

  it('escapes characters that are not markup in plain text', () => {
    expect(plainTextToHtml('Q&A <3 a > b')).toBe('<p>Q&amp;A &lt;3 a &gt; b</p>')
  })

  it('returns real HTML untouched', () => {
    const html = '<p>Hello <b>world</b></p>\n<ul><li>one</li></ul>'

    expect(plainTextToHtml(html)).toBe(html)
  })
})
