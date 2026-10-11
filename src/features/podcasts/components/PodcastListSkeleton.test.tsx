import { render, screen } from '@testing-library/react'

import PodcastGrid from './PodcastGrid'
import PodcastListSkeleton from './PodcastListSkeleton'

describe('PodcastListSkeleton', () => {
  it('renders a busy status with 10 placeholders', () => {
    render(<PodcastListSkeleton />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByTestId('podcast-skeleton')).toHaveLength(10)
    expect(screen.getAllByRole('listitem')).toHaveLength(10)
  })

  it('lays out the placeholders with the real PodcastGrid classes', () => {
    render(<PodcastListSkeleton />)
    const { container } = render(
      <PodcastGrid>
        <div />
      </PodcastGrid>,
    )

    expect(screen.getByRole('status').querySelector('ul')?.className).toBe(
      container.querySelector('ul')?.className,
    )
  })
})
