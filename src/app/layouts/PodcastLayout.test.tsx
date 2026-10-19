import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { useSelectedPodcast } from '../../features/podcast-detail'
import { TOP_PODCASTS_URL } from '../../shared/api/config'
import { createQueryClient } from '../../shared/api/queryClient'
import podcastDetails from '../../test/mocks/podcastDetails.json'
import podcastList from '../../test/mocks/podcastList.json'
import { server } from '../../test/mocks/server'
import { renderRoutes } from '../../test/renderWithProviders'
import { routes } from '../router'
import PodcastLayout from './PodcastLayout'

const LISTED_ID = '1535809341'
const LISTED_NAME = 'The Joe Budden Podcast'
const UNLISTED_NAME = 'Switched on Pop'
const LOOKUP = 'https://itunes.apple.com/lookup'

const renderAt = (path: string) => renderRoutes(routes, { route: path })

const gate = () => {
  let release: () => void = () => undefined
  const promise = new Promise<void>((resolve) => {
    release = resolve
  })
  return { promise, release }
}

describe('PodcastLayout', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('renders the sidebar from the listed podcast while the detail is still loading', async () => {
    const detailGate = gate()
    server.use(
      http.get(LOOKUP, async () => {
        await detailGate.promise
        return HttpResponse.json(podcastDetails)
      }),
    )

    renderAt(`/podcast/${LISTED_ID}`)

    const sidebar = await screen.findByRole('complementary')
    expect(within(sidebar).getByRole('heading', { name: LISTED_NAME })).toBeInTheDocument()
    expect(within(sidebar).getByText(/^by /)).toBeInTheDocument()
    expect(within(sidebar).getByAltText(LISTED_NAME)).toBeInTheDocument()
    expect(within(sidebar).getByRole('heading', { name: 'Description' })).toBeInTheDocument()

    detailGate.release()
  })

  it('shows the skeleton only on the right until the detail arrives', async () => {
    const detailGate = gate()
    server.use(
      http.get(LOOKUP, async () => {
        await detailGate.promise
        return HttpResponse.json(podcastDetails)
      }),
    )

    renderAt(`/podcast/${LISTED_ID}`)

    const sidebar = await screen.findByRole('complementary')
    const skeleton = screen.getByRole('status', { name: 'Loading episodes' })
    expect(sidebar).not.toContainElement(skeleton)
    expect(screen.queryByText(/^Episodes: /)).not.toBeInTheDocument()

    detailGate.release()

    expect(await screen.findByText(/^Episodes: /)).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading episodes' })).not.toBeInTheDocument()
  })

  it('falls back to the detail data, without description, when the podcast is not listed', async () => {
    renderAt('/podcast/1')

    const sidebar = await screen.findByRole('complementary')
    expect(within(sidebar).getByRole('heading', { name: UNLISTED_NAME })).toBeInTheDocument()
    expect(within(sidebar).getByText('by Vulture')).toBeInTheDocument()
    expect(within(sidebar).queryByRole('heading', { name: 'Description' })).not.toBeInTheDocument()
  })

  it('renders the sidebar from the detail, without description, when the list fails', async () => {
    server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse(null, { status: 500 })))

    renderAt(`/podcast/${LISTED_ID}`)

    expect(await screen.findByRole('heading', { name: UNLISTED_NAME })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Description' })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('keeps the sidebar mounted when navigating to an episode', async () => {
    const { router } = renderAt(`/podcast/${LISTED_ID}`)
    const sidebar = await screen.findByRole('complementary')
    await screen.findByText(/^Episodes: /)

    await act(() => router.navigate(`/podcast/${LISTED_ID}/episode/1000793367564`))

    expect(
      await screen.findByRole('heading', { name: 'Has Taylor Swift jumped the shark?' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBe(sidebar)
  })

  it('requests the list first and then the detail, once each', async () => {
    const calls: string[] = []
    const listGate = gate()
    server.use(
      http.get(LOOKUP, () => {
        calls.push('detail')
        return HttpResponse.json(podcastDetails)
      }),
      http.get(TOP_PODCASTS_URL, async () => {
        calls.push('list')
        await listGate.promise
        return HttpResponse.json(podcastList)
      }),
    )

    renderRoutes(routes, { route: `/podcast/${LISTED_ID}`, queryClient: createQueryClient() })

    await waitFor(() => expect(calls).toEqual(['list']))
    listGate.release()
    await screen.findByText(/^Episodes: /)

    expect(calls).toEqual(['list', 'detail'])
  })

  it('shows the generic error when the detail returns 500', async () => {
    server.use(http.get(LOOKUP, () => new HttpResponse(null, { status: 500 })))

    renderAt(`/podcast/${LISTED_ID}`)

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(consoleError).toHaveBeenCalled()
  })

  it('renders the page without error or log when iTunes has no results for the id', async () => {
    server.use(http.get(LOOKUP, () => HttpResponse.json({ resultCount: 0, results: [] })))

    renderAt('/podcast/9345528')

    expect(await screen.findByText('Episodes: 0')).toBeInTheDocument()
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('keeps the listed sidebar when iTunes has no results for the id', async () => {
    server.use(http.get(LOOKUP, () => HttpResponse.json({ resultCount: 0, results: [] })))

    renderAt(`/podcast/${LISTED_ID}`)

    expect(await screen.findByText('Episodes: 0')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: LISTED_NAME })).toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('shows "Podcast not found." and logs on a 400 (invalid id)', async () => {
    server.use(http.get(LOOKUP, () => new HttpResponse(null, { status: 400 })))

    renderAt('/podcast/abc')

    expect(await screen.findByRole('alert')).toHaveTextContent('Podcast not found.')
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(consoleError).toHaveBeenCalled()
  })

  describe('selected podcast context', () => {
    const SelectedPodcastProbe = () => {
      const { podcastId, podcast, detail } = useSelectedPodcast()
      return <p>{`${podcastId} | ${podcast?.name} | ${detail.episodeCount}`}</p>
    }

    it('gives the child routes the podcast id, the sidebar podcast and the detail', async () => {
      renderRoutes(
        () => [
          {
            path: '/podcast/:podcastId',
            element: <PodcastLayout />,
            children: [{ index: true, element: <SelectedPodcastProbe /> }],
          },
        ],
        { route: `/podcast/${LISTED_ID}` },
      )

      expect(await screen.findByText(`${LISTED_ID} | ${LISTED_NAME} | 556`)).toBeInTheDocument()
    })

    const countLookups = () => {
      const lookups = { count: 0 }
      server.use(
        http.get(LOOKUP, () => {
          lookups.count += 1
          return HttpResponse.json(podcastDetails)
        }),
      )
      return lookups
    }

    it('shows the same sidebar with one lookup on a direct load', async () => {
      const lookups = countLookups()

      // Real client: the test client has staleTime 0 and would refetch when the page mounts.
      renderRoutes(routes, { route: `/podcast/${LISTED_ID}`, queryClient: createQueryClient() })

      await screen.findByText(/^Episodes: /)
      const sidebar = screen.getByRole('complementary')
      expect(within(sidebar).getByRole('heading', { name: LISTED_NAME })).toBeInTheDocument()
      expect(lookups.count).toBe(1)
    })

    it('shows the same sidebar with one lookup when coming from the list', async () => {
      const lookups = countLookups()
      renderRoutes(routes, { queryClient: createQueryClient() })

      await userEvent.click(await screen.findByRole('link', { name: new RegExp(LISTED_NAME) }))

      await screen.findByText(/^Episodes: /)
      const sidebar = screen.getByRole('complementary')
      expect(within(sidebar).getByRole('heading', { name: LISTED_NAME })).toBeInTheDocument()
      expect(lookups.count).toBe(1)
    })

    it('switches the sidebar and the episode links when navigating to another podcast', async () => {
      const OTHER_ID = '1751194045'
      const { router } = renderAt(`/podcast/${LISTED_ID}`)
      await screen.findByText(/^Episodes: /)
      const sidebar = screen.getByRole('complementary')

      await act(() => router.navigate(`/podcast/${OTHER_ID}`))

      expect(
        await within(sidebar).findByRole('heading', { name: /Tony Mantor/ }),
      ).toBeInTheDocument()
      expect(screen.getByRole('complementary')).toBe(sidebar)
      expect(
        await screen.findByRole('link', { name: 'Has Taylor Swift jumped the shark?' }),
      ).toHaveAttribute('href', `/podcast/${OTHER_ID}/episode/1000793367564`)
    })
  })
})
