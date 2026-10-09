import { render, screen } from '@testing-library/react'

import EpisodeDescription from './EpisodeDescription'

describe('EpisodeDescription', () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).__pwned
  })

  it('renders allowed markup', () => {
    const { container } = render(
      <EpisodeDescription
        html={
          '<p>Hello <b>bold</b> <i>it</i></p><ul><li>one</li></ul><a href="https://a.test">link</a>'
        }
      />,
    )

    expect(container.querySelector('p')).toHaveTextContent('Hello bold it')
    expect(container.querySelector('b')).toHaveTextContent('bold')
    expect(container.querySelector('i')).toHaveTextContent('it')
    expect(screen.getByRole('listitem')).toHaveTextContent('one')
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('href', 'https://a.test')
  })

  it('removes scripts and never runs them', () => {
    const { container } = render(
      <EpisodeDescription html={'<p>ok</p><script>window.__pwned = true</script>'} />,
    )

    expect(container.querySelector('script')).not.toBeInTheDocument()
    expect((window as unknown as Record<string, unknown>).__pwned).toBeUndefined()
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('removes event handler attributes', () => {
    const { container } = render(
      <EpisodeDescription
        html={
          '<img src="x.png" alt="pic" onerror="window.__pwned=true"><p onclick="window.__pwned=true">t</p>'
        }
      />,
    )

    expect(container.querySelector('[onerror]')).not.toBeInTheDocument()
    expect(container.querySelector('[onclick]')).not.toBeInTheDocument()
    expect(screen.getByAltText('pic')).toBeInTheDocument()
    expect((window as unknown as Record<string, unknown>).__pwned).toBeUndefined()
  })

  it('removes javascript: hrefs', () => {
    render(<EpisodeDescription html={'<a href="javascript:alert(1)">bad</a>'} />)

    expect(screen.getByText('bad')).not.toHaveAttribute('href')
  })

  it('removes iframes', () => {
    const { container } = render(
      <EpisodeDescription html={'<p>x</p><iframe src="https://evil.test"></iframe>'} />,
    )

    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('opens links in a new tab safely', () => {
    render(<EpisodeDescription html={'<a href="https://a.test">link</a>'} />)

    const link = screen.getByRole('link', { name: 'link' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it.each([undefined, '', '   ', '\n\t'])('renders nothing for %j', (html) => {
    const { container } = render(<EpisodeDescription html={html} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('updates the content when html changes', () => {
    const { rerender } = render(<EpisodeDescription html="<p>first</p>" />)
    expect(screen.getByText('first')).toBeInTheDocument()

    rerender(<EpisodeDescription html="<p>second</p>" />)

    expect(screen.getByText('second')).toBeInTheDocument()
    expect(screen.queryByText('first')).not.toBeInTheDocument()
  })

  it('renders plain text as paragraphs, with single line breaks kept', () => {
    const { container } = render(
      <EpisodeDescription html={'Intro.\n\n\n\nSecond.\nSame paragraph.\n\nThird.'} />,
    )

    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(3)
    expect(paragraphs[1].querySelector('br')).toBeInTheDocument()
    expect(paragraphs[1]).toHaveTextContent('Second.Same paragraph.')
  })

  it('escapes plain text instead of interpreting it as markup', () => {
    const { container } = render(<EpisodeDescription html={'I <3 Q&A'} />)

    expect(container.querySelector('p')?.textContent).toBe('I <3 Q&A')
  })
})
