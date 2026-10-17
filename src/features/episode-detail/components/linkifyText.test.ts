import { linkifyText } from './linkifyText'

const anchor = (href: string, label = href) => `<a href="${href}">${label}</a>`

describe('linkifyText', () => {
  it.each([
    ['https://example.com/a', 'https://example.com/a'],
    ['http://example.com/a', 'http://example.com/a'],
  ])('links %s', (url, href) => {
    expect(linkifyText(url)).toBe(anchor(href))
  })

  it('adds https to www. URLs and keeps the label as written', () => {
    expect(linkifyText('www.example.com')).toBe(
      anchor('https://www.example.com', 'www.example.com'),
    )
  })

  it('links a bare domain with a path', () => {
    expect(linkifyText('podcastchoices.com/adchoices')).toBe(
      anchor('https://podcastchoices.com/adchoices', 'podcastchoices.com/adchoices'),
    )
  })

  it('links a bare domain with a known TLD', () => {
    expect(linkifyText('Visit songexploder.net now')).toBe(
      `Visit ${anchor('https://songexploder.net', 'songexploder.net')} now`,
    )
  })

  it('escapes & in the href and the label', () => {
    const url = 'https://www.tiktok.com/@show?is_from_webapp=1&sender_device=pc'

    expect(linkifyText(url)).toBe(anchor(url.replace('&', '&amp;')))
  })

  it.each([
    ['See https://example.com.', `See ${anchor('https://example.com')}.`],
    ['https://example.com, then', `${anchor('https://example.com')}, then`],
    ['(https://example.com)', `(${anchor('https://example.com')})`],
    ['Really https://example.com?', `Really ${anchor('https://example.com')}?`],
  ])('keeps trailing punctuation outside the link: %s', (text, expected) => {
    expect(linkifyText(text)).toBe(expected)
  })

  it('keeps parentheses that belong to the URL', () => {
    const url = 'https://en.wikipedia.org/wiki/Rock_(music)'

    expect(linkifyText(`See ${url}.`)).toBe(`See ${anchor(url)}.`)
  })

  it.each([
    ['"https://example.com"', `"${anchor('https://example.com')}"`],
    ['“https://example.com”', `“${anchor('https://example.com')}”`],
  ])('does not swallow surrounding quotes: %s', (text, expected) => {
    expect(linkifyText(text)).toBe(expected)
  })

  it('links several URLs and keeps the text between them', () => {
    expect(linkifyText('a https://one.test b\nwww.two.com c')).toBe(
      `a ${anchor('https://one.test')} b\n${anchor('https://www.two.com', 'www.two.com')} c`,
    )
  })

  it('does not link emails', () => {
    expect(linkifyText('write to ana@example.com')).toBe('write to ana@example.com')
    expect(linkifyText('mailto:ana@example.com')).toBe('mailto:ana@example.com')
  })

  it('escapes markup characters and does not interpret them', () => {
    expect(linkifyText('<b>Q&A</b> a > b')).toBe('&lt;b&gt;Q&amp;A&lt;/b&gt; a &gt; b')
  })

  it('escapes markup next to a link', () => {
    expect(linkifyText('<i>https://example.com</i>')).toBe(
      `&lt;i&gt;${anchor('https://example.com')}&lt;/i&gt;`,
    )
  })

  it('cannot break out of the href attribute', () => {
    expect(linkifyText(`https://x.test/"onmouseover="alert(1)`)).toBe(
      '<a href="https://x.test/&quot;onmouseover=&quot;alert(1)">https://x.test/"onmouseover="alert(1)</a>',
    )
    expect(linkifyText(`https://y.test/'onfocus='alert(2)`)).toBe(
      '<a href="https://y.test/&#39;onfocus=&#39;alert(2)">https://y.test/\'onfocus=\'alert(2)</a>',
    )
  })

  it('does not link javascript: URLs', () => {
    expect(linkifyText('javascript:alert(1)')).not.toContain('<a')
  })

  it('returns an empty string for empty input', () => {
    expect(linkifyText('')).toBe('')
  })
})
