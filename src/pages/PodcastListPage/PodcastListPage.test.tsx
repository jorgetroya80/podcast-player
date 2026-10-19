import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { routes } from '../../app/router'
import { renderRoutes } from '../../test/renderWithProviders'

describe('PodcastListPage', () => {
  it('renders the filter and the podcast list', async () => {
    renderRoutes(routes)

    expect(await screen.findByRole('search')).toBeInTheDocument()
    expect(await screen.findByText('The Joe Budden Podcast')).toBeInTheDocument()
  })

  it('filters the list by title and author', async () => {
    renderRoutes(routes)
    await screen.findByText('The Joe Budden Podcast')
    const input = screen.getByLabelText('Filter podcasts')

    await userEvent.type(input, 'budden')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)

    await userEvent.clear(input)
    await userEvent.type(input, 'zzzz')
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('navigates to the podcast detail on click', async () => {
    renderRoutes(routes)

    await userEvent.click(await screen.findByRole('link', { name: /The Joe Budden Podcast/ }))

    expect(await screen.findByText(/^Episodes: /)).toBeInTheDocument()
  })

  describe('filter across navigation', () => {
    const filterAndOpenPodcast = async () => {
      const rendered = renderRoutes(routes)
      await screen.findByText('The Joe Budden Podcast')
      await userEvent.type(screen.getByLabelText('Filter podcasts'), 'budden')
      await userEvent.click(screen.getByRole('link', { name: /The Joe Budden Podcast/ }))
      await screen.findByText(/^Episodes: /)
      return rendered
    }

    const expectFilterKept = async () => {
      expect(await screen.findByLabelText('Filter podcasts')).toHaveValue('budden')
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    }

    it('keeps the filter when going back with the header link', async () => {
      await filterAndOpenPodcast()

      await userEvent.click(screen.getByRole('link', { name: 'Podcaster' }))

      await expectFilterKept()
    })

    it('keeps the filter when going back in history', async () => {
      const { router } = await filterAndOpenPodcast()

      await act(() => router.navigate(-1))

      await expectFilterKept()
    })

    it('starts with an empty filter on a fresh load', async () => {
      const { unmount } = await filterAndOpenPodcast()
      unmount()

      renderRoutes(routes)

      expect(await screen.findByLabelText('Filter podcasts')).toHaveValue('')
    })
  })
})
