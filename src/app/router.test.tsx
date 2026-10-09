import { http, HttpResponse } from 'msw'
import { screen } from '@testing-library/react'

import { server } from '../test/mocks/server'
import { TOP_PODCASTS_URL } from '../shared/api/config'
import { routes } from './router'
import { renderRoutes } from '../test/renderWithProviders'

const renderAt = (path: string) => renderRoutes(routes, { route: path })

describe('routes', () => {
  it('shows the skeleton while the first load is pending, then the list', async () => {
    renderAt('/')
    expect(screen.getByRole('status', { name: 'Loading podcasts' })).toBeInTheDocument()
    expect(await screen.findByRole('search')).toBeInTheDocument()
  })

  it('renders the podcast detail page at /podcast/:id', async () => {
    renderAt('/podcast/1')
    expect(await screen.findByText(/^Episodes: /)).toBeInTheDocument()
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('renders the episode page at /podcast/:id/episode/:episodeId', async () => {
    renderAt('/podcast/1/episode/2')
    expect(await screen.findByRole('heading', { name: /episode detail/i })).toBeInTheDocument()
  })

  it('shows the error and keeps the header when the podcasts request fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())
    server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse(null, { status: 500 })))

    renderAt('/')

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
