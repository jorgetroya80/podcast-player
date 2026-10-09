import { render, screen } from '@testing-library/react'

import EpisodeListEmpty from './EpisodeListEmpty'

describe('EpisodeListEmpty', () => {
  it('renders the empty message', () => {
    render(<EpisodeListEmpty />)

    expect(screen.getByText('No episodes available')).toBeInTheDocument()
  })
})
