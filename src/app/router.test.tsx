import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { routes } from './router'

const renderAt = (path: string) => {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

describe('routes', () => {
  it.each([
    ['/', /podcast list/i],
    ['/podcast/1', /podcast detail/i],
    ['/podcast/1/episode/2', /episode detail/i],
  ])('renders the right page at %s', (path, heading) => {
    renderAt(path)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })
})
