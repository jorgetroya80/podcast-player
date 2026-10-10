import { http, HttpResponse } from 'msw'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
    renderAt('/podcast/1/episode/1000793367564')
    expect(
      await screen.findByRole('heading', { name: 'Has Taylor Swift jumped the shark?' }),
    ).toBeInTheDocument()
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

  describe('unknown URLs', () => {
    it.each(['/nope', '/podcast/1/unknown-segment', '/a/b/c'])(
      'shows "Page not found." below the header at %s',
      async (path) => {
        renderAt(path)

        expect(await screen.findByRole('alert')).toHaveTextContent('Page not found.')
        expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
        expect(screen.queryByText(/Unexpected Application Error/)).not.toBeInTheDocument()
      },
    )

    it('goes back to the list from the header link', async () => {
      const user = userEvent.setup()
      renderAt('/nope')

      await user.click(await screen.findByRole('link', { name: 'Podcaster' }))

      expect(await screen.findByRole('search')).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('does not log a plain 404 with console.error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => vi.fn())

      renderAt('/nope')
      await screen.findByRole('alert')

      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })
})
