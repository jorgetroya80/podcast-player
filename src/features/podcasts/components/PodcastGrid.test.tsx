import { render, screen } from '@testing-library/react'

import PodcastGrid from './PodcastGrid'

describe('PodcastGrid', () => {
  it('wraps each child in its own list item', () => {
    render(
      <PodcastGrid>
        <a href="/one">One</a>
        <div>Two</div>
      </PodcastGrid>,
    )

    const items = screen.getAllByRole('listitem')
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(items).toHaveLength(2)
    items.forEach((item) => {
      expect(item.parentElement).toBe(screen.getByRole('list'))
      expect(item.children).toHaveLength(1)
    })
  })

  it('does not render empty list items for null or false children', () => {
    render(
      <PodcastGrid>
        {null}
        <div>One</div>
        {false}
        {undefined}
      </PodcastGrid>,
    )

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('One')
  })

  it('keeps the grid classes on the list', () => {
    render(
      <PodcastGrid>
        <div />
      </PodcastGrid>,
    )

    expect(screen.getByRole('list')).toHaveClass('mt-10', 'grid', 'grid-cols-1', 'xl:grid-cols-4')
  })

  it('does not emit React key warnings for mapped children', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <PodcastGrid>
        {['a', 'b', 'c'].map((id) => (
          <div key={id}>{id}</div>
        ))}
      </PodcastGrid>,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
