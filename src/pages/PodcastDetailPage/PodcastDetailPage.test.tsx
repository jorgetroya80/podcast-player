import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { routes } from '../../app/router'
import podcastDetails from '../../test/mocks/podcastDetails.json'
import { server } from '../../test/mocks/server'
import { renderRoutes } from '../../test/renderWithProviders'

const LOOKUP = 'https://itunes.apple.com/lookup'
const PODCAST_ID = '934552872'
const EPISODE_ID = '1000793367564'
const EPISODE_TITLE = 'Has Taylor Swift jumped the shark?'

const renderAt = (path: string) => renderRoutes(routes, { route: path })

describe('PodcastDetailPage', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('shows the API episode count and the episode table with formatted data', async () => {
    renderAt(`/podcast/${PODCAST_ID}`)

    expect(await screen.findByText('Episodes: 556')).toBeInTheDocument()
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(2)
    const row = within(rows[1]!)
    expect(row.getByRole('link', { name: EPISODE_TITLE })).toHaveAttribute(
      'href',
      `/podcast/${PODCAST_ID}/episode/${EPISODE_ID}`,
    )
    expect(row.getByText('06/10/2026')).toBeInTheDocument()
    expect(row.getByText('47:55')).toBeInTheDocument()
    expect(screen.queryByText('No episodes available')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /podcast detail/i })).not.toBeInTheDocument()
  })

  it('navigates to the episode and keeps the sidebar mounted', async () => {
    const user = userEvent.setup()
    renderAt(`/podcast/${PODCAST_ID}`)
    const sidebar = await screen.findByRole('complementary')

    await user.click(await screen.findByRole('link', { name: EPISODE_TITLE }))

    expect(
      await screen.findByRole('heading', { name: EPISODE_TITLE, level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBe(sidebar)
  })

  it('shows the count and the empty message when the podcast has no episodes', async () => {
    server.use(
      http.get(LOOKUP, () =>
        HttpResponse.json({ resultCount: 1, results: [podcastDetails.results[0]] }),
      ),
    )

    renderAt(`/podcast/${PODCAST_ID}`)

    expect(await screen.findByText('Episodes: 556')).toBeInTheDocument()
    expect(screen.getByText('No episodes available')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows zero episodes without error or log when iTunes returns no results', async () => {
    server.use(http.get(LOOKUP, () => HttpResponse.json({ resultCount: 0, results: [] })))

    renderAt('/podcast/9345528')

    expect(await screen.findByText('Episodes: 0')).toBeInTheDocument()
    expect(screen.getByText('No episodes available')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('shows the generic error and keeps the header on a 500', async () => {
    server.use(http.get(LOOKUP, () => new HttpResponse(null, { status: 500 })))

    renderAt(`/podcast/${PODCAST_ID}`)

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(consoleError).toHaveBeenCalled()
  })

  it('shows "Podcast not found." on a 400', async () => {
    server.use(http.get(LOOKUP, () => new HttpResponse(null, { status: 400 })))

    renderAt('/podcast/abc')

    expect(await screen.findByRole('alert')).toHaveTextContent('Podcast not found.')
    expect(consoleError).toHaveBeenCalled()
  })

  it('shows the skeleton and no table while the detail is pending', async () => {
    let release: () => void = () => undefined
    const pending = new Promise<void>((resolve) => {
      release = resolve
    })
    server.use(
      http.get(LOOKUP, async () => {
        await pending
        return HttpResponse.json(podcastDetails)
      }),
    )

    renderAt('/podcast/1535809341')

    await screen.findByRole('complementary')
    expect(screen.getByRole('status', { name: 'Loading episodes' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    release()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading episodes' })).not.toBeInTheDocument()
  })
})
