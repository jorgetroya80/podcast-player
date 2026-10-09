import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { routes } from '../../app/router'
import podcastDetails from '../../test/mocks/podcastDetails.json'
import { server } from '../../test/mocks/server'
import { renderRoutes } from '../../test/renderWithProviders'

const LOOKUP = 'https://itunes.apple.com/lookup'
const PODCAST_ID = '934552872'
const LISTED_ID = '1535809341'
const EPISODE_ID = '1000793367564'
const EPISODE_TITLE = 'Has Taylor Swift jumped the shark?'

const renderAt = (path: string) => renderRoutes(routes, { route: path })
const episodePath = (podcastId: string, episodeId = EPISODE_ID) =>
  `/podcast/${podcastId}/episode/${episodeId}`

describe('EpisodeDetailPage', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('shows title, date and duration with the sidebar visible', async () => {
    renderAt(episodePath(PODCAST_ID))

    expect(await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
    expect(screen.getByText('Released: 06/10/2026')).toBeInTheDocument()
    expect(screen.getByText('Duration: 47:55')).toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('works on a direct load of a listed podcast, with the sidebar from the list', async () => {
    renderAt(episodePath(LISTED_ID))

    expect(await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
    const sidebar = screen.getByRole('complementary')
    expect(within(sidebar).getByRole('heading', { name: 'The Joe Budden Podcast' })).toBeVisible()
  })

  it('omits the duration when the episode has none', async () => {
    const [podcast, episode] = podcastDetails.results
    const withoutDuration: Record<string, unknown> = { ...episode }
    delete withoutDuration.trackTimeMillis
    server.use(
      http.get(LOOKUP, () =>
        HttpResponse.json({ resultCount: 2, results: [podcast, withoutDuration] }),
      ),
    )

    renderAt(episodePath(PODCAST_ID))

    expect(await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
    expect(screen.getByText('Released: 06/10/2026')).toBeInTheDocument()
    expect(screen.queryByText(/Duration/)).not.toBeInTheDocument()
  })

  it('shows "Episode not found." keeping sidebar and header, and logs once', async () => {
    renderAt(episodePath(PODCAST_ID, 'unknown'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Episode not found.')
    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByText(EPISODE_TITLE)).not.toBeInTheDocument()
    expect(consoleError).toHaveBeenCalledTimes(1)
  })

  it('shows "Episode not found." when the detail has no results', async () => {
    server.use(http.get(LOOKUP, () => HttpResponse.json({ resultCount: 0, results: [] })))

    renderAt(episodePath('9345528', '5'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Episode not found.')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('opens the episode from the podcast page keeping the same sidebar', async () => {
    const user = userEvent.setup()
    renderAt(`/podcast/${PODCAST_ID}`)
    const sidebar = await screen.findByRole('complementary')

    await user.click(await screen.findByRole('link', { name: EPISODE_TITLE }))

    expect(await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
    expect(screen.getByText('Duration: 47:55')).toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBe(sidebar)
  })

  it('shows the generic error and keeps the header when the detail returns 500', async () => {
    server.use(http.get(LOOKUP, () => new HttpResponse(null, { status: 500 })))

    renderAt(episodePath(PODCAST_ID))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(consoleError).toHaveBeenCalled()
  })
})
