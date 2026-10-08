import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import Header from './Header'

describe('Header component', () => {
  it('have the link to the home page', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Podcaster' })).toHaveAttribute('href', '/')
  })
})