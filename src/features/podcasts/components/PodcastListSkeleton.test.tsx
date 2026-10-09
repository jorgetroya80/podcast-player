import { render, screen } from '@testing-library/react'

import PodcastListSkeleton from './PodcastListSkeleton'

describe('PodcastListSkeleton', () => {
  it('renders a busy status with 10 placeholders', () => {
    render(<PodcastListSkeleton />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByTestId('podcast-skeleton')).toHaveLength(10)
  })
})
