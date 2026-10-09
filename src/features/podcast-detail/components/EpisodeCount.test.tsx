import { render, screen } from '@testing-library/react'

import EpisodeCount from './EpisodeCount'

describe('EpisodeCount', () => {
  it('renders the count', () => {
    render(<EpisodeCount count={312} />)

    expect(screen.getByText('Episodes: 312')).toBeInTheDocument()
  })
})
