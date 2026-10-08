import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { routes } from './router'
import { createQueryClient } from '../shared/api/queryClient'

const renderAt = (path: string) => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes(createQueryClient()), { initialEntries: [path] })}
    />,
  )
}

describe('routes', () => {
  it.each([
    ['/', /podcast list/i],
    ['/podcast/1', /podcast detail/i],
    ['/podcast/1/episode/2', /episode detail/i],
  ])('renders the right page at %s', async (path, heading) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument()
  })
})
