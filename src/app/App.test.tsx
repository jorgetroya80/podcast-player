import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'

import App from './App'
import { routes } from './router'
import { createQueryClient } from '../shared/api/queryClient'

describe('App', () => {
  it('renders the current route', () => {
    render(<App router={createMemoryRouter(routes)} queryClient={createQueryClient()} />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
