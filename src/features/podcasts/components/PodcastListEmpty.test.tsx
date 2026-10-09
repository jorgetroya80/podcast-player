import { render, screen } from '@testing-library/react'

import PodcastListEmpty from './PodcastListEmpty'

describe('PodcastListEmpty', () => {
  it('shows the message without a query', () => {
    render(<PodcastListEmpty />)

    expect(screen.getByText('No podcasts available right now')).toBeInTheDocument()
  })

  it('shows the message about not found with a query', () => {
    render(<PodcastListEmpty query="zzz" />)

    expect(screen.getByText('No podcasts found by "zzz"')).toBeInTheDocument()
  })
})
