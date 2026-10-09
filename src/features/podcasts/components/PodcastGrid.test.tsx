import { render, screen } from '@testing-library/react'

import PodcastGrid from './PodcastGrid'

describe('PodcastGrid', () => {
  it('renders its children inside a list', () => {
    render(
      <PodcastGrid>
        <li>One</li>
        <li>Two</li>
      </PodcastGrid>,
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
