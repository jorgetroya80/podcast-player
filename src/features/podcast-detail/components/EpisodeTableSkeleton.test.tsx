import { render, screen } from '@testing-library/react'

import EpisodeTableSkeleton from './EpisodeTableSkeleton'

describe('EpisodeTableSkeleton', () => {
  it('renders a busy status with 10 placeholders', () => {
    render(<EpisodeTableSkeleton />)

    const status = screen.getByRole('status', { name: 'Loading episodes' })
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByTestId('episode-skeleton')).toHaveLength(10)
  })
})
