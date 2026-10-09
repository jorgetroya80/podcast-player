import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import PodcastCard from './PodcastCard'

describe('PodcastCard', () => {
  it('renders name, author and a link to the podcast detail', () => {
    render(
      <MemoryRouter>
        <PodcastCard id="42" name="Serial" artist="Sarah Koenig" image="https://img/1.png" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link')).toHaveAttribute('href', '/podcast/42')
    expect(screen.getByRole('heading', { name: 'Serial' })).toBeInTheDocument()
    expect(screen.getByText('Author: Sarah Koenig')).toBeInTheDocument()
  })
})
