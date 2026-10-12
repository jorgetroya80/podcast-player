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
    expect(screen.queryByText(/Duration/)).not.toBeInTheDocument()
  })

  it('shows the audio player for an episode with audio', async () => {
    const { container } = renderAt(episodePath(PODCAST_ID))

    await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })
    const audio = container.querySelector('audio')
    expect(audio).toHaveAttribute('src', podcastDetails.results[1].episodeUrl)
    expect(screen.queryByText('Audio not available for this episode.')).not.toBeInTheDocument()
  })

  it('shows a message instead of the player when the episode has no audio', async () => {
    const [podcast, episode] = podcastDetails.results
    const withoutAudio: Record<string, unknown> = { ...episode }
    delete withoutAudio.episodeUrl
    server.use(
      http.get(LOOKUP, () =>
        HttpResponse.json({ resultCount: 2, results: [podcast, withoutAudio] }),
      ),
    )

    const { container } = renderAt(episodePath(PODCAST_ID))

    expect(await screen.findByText('Audio not available for this episode.')).toBeInTheDocument()
    expect(container.querySelector('audio')).not.toBeInTheDocument()
  })

  it('shows "Episode not found." keeping sidebar and header, and logs once', async () => {
    renderAt(episodePath(PODCAST_ID, 'unknown'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Episode not found.')
    expect(screen.getByRole('complementary')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByText(EPISODE_TITLE)).not.toBeInTheDocument()
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith('Episode not found:', {
      podcastId: PODCAST_ID,
      episodeId: 'unknown',
    })
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
    expect(screen.getByRole('complementary')).toBe(sidebar)
  })

  it('shows the right episode when opening one episode after another', async () => {
    const [podcast, episode] = podcastDetails.results
    const second = { ...episode, trackId: 2, trackName: 'Second episode' }
    server.use(
      http.get(LOOKUP, () =>
        HttpResponse.json({ resultCount: 3, results: [podcast, episode, second] }),
      ),
    )
    const user = userEvent.setup()
    renderAt(episodePath(PODCAST_ID))
    expect(await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
    const sidebar = screen.getByRole('complementary')

    await user.click(within(sidebar).getByRole('link', { name: 'by Vulture' }))
    await user.click(await screen.findByRole('link', { name: 'Second episode' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Second episode' })).toBeVisible()
    expect(screen.queryByText(EPISODE_TITLE)).not.toBeInTheDocument()
    expect(screen.getByRole('complementary')).toBe(sidebar)
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('shows the generic error and keeps the header when the detail returns 500', async () => {
    server.use(http.get(LOOKUP, () => new HttpResponse(null, { status: 500 })))

    renderAt(episodePath(PODCAST_ID))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(consoleError).toHaveBeenCalled()
  })

  describe('description', () => {
    const withDescription = (description?: string) => {
      const [podcast, episode] = podcastDetails.results
      const changed: Record<string, unknown> = { ...episode }
      if (description === undefined) delete changed.description
      else changed.description = description
      server.use(
        http.get(LOOKUP, () => HttpResponse.json({ resultCount: 2, results: [podcast, changed] })),
      )
    }

    it('shows the formatted description', async () => {
      withDescription('<p>Hello <b>brave</b> world</p>')

      const { container } = renderAt(episodePath(PODCAST_ID))

      expect(await screen.findByText('brave')).toBeVisible()
      expect(container.querySelector('article b')).toHaveTextContent('brave')
      expect(screen.getByText('world', { exact: false })).toBeVisible()
    })

    it('renders the description without scripts or event handlers', async () => {
      withDescription(
        '<p>Safe text</p><script>alert(1)</script><img src="x.png" onerror="alert(1)">',
      )

      const { container } = renderAt(episodePath(PODCAST_ID))

      expect(await screen.findByText('Safe text')).toBeVisible()
      expect(container.querySelector('script')).not.toBeInTheDocument()
      expect(container.querySelector('[onerror]')).not.toBeInTheDocument()
      expect(container).not.toHaveTextContent('alert(1)')
    })

    it('turns plain-text URLs in the description into links', async () => {
      withDescription(
        'Follow us\nhttps://www.instagram.com/60songsthatexplainthe90s\n' +
          'https://www.tiktok.com/@60songsthatexplainthe90s\n\n' +
          'podcastchoices.com/adchoices',
      )

      renderAt(episodePath(PODCAST_ID))

      const link = await screen.findByRole('link', { name: 'podcastchoices.com/adchoices' })
      expect(link).toHaveAttribute('href', 'https://podcastchoices.com/adchoices')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(
        screen.getByRole('link', { name: /^https:\/\/www\.tiktok\.com\/@60songs/ }),
      ).toHaveAttribute('href', 'https://www.tiktok.com/@60songsthatexplainthe90s')
      expect(
        screen.getByRole('link', { name: /^https:\/\/www\.instagram\.com\/60songs/ }),
      ).toHaveAttribute('href', 'https://www.instagram.com/60songsthatexplainthe90s')
    })

    it('renders no description block when the episode has no description', async () => {
      withDescription(undefined)

      const { container } = renderAt(episodePath(PODCAST_ID))

      await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })
      expect(container.querySelector('article section')).not.toBeInTheDocument()
    })
  })

  describe('complete and minimal episodes', () => {
    const serveEpisode = (omit: string[] = []) => {
      const [podcast, episode] = podcastDetails.results
      const changed: Record<string, unknown> = {
        ...episode,
        description: '<p>Full <b>description</b></p>',
      }
      for (const key of omit) delete changed[key]
      server.use(
        http.get(LOOKUP, () => HttpResponse.json({ resultCount: 2, results: [podcast, changed] })),
      )
    }

    it('shows title, date, duration, player and description together', async () => {
      serveEpisode()

      const { container } = renderAt(episodePath(PODCAST_ID))

      const article = await screen.findByRole('article')
      expect(within(article).getByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
      expect(container.querySelector('article audio')).toHaveAttribute(
        'src',
        podcastDetails.results[1].episodeUrl,
      )
      expect(within(article).getByText('description')).toBeVisible()
      expect(consoleError).not.toHaveBeenCalled()
    })

    it.each([
      ['duration', ['trackTimeMillis']],
      ['audio', ['episodeUrl']],
      ['description', ['description']],
    ])('renders the rest of the episode without %s', async (_part, omit) => {
      serveEpisode(omit)

      renderAt(episodePath(PODCAST_ID))

      const article = await screen.findByRole('article')
      expect(within(article).getByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
    })

    it('renders just title, date and the audio message without any optional part', async () => {
      serveEpisode(['trackTimeMillis', 'episodeUrl', 'description'])

      const { container } = renderAt(episodePath(PODCAST_ID))

      const article = await screen.findByRole('article')
      expect(within(article).getByRole('heading', { level: 1, name: EPISODE_TITLE })).toBeVisible()
      expect(within(article).getByText('Audio not available for this episode.')).toBeVisible()
      expect(within(article).queryByText(/Duration/)).not.toBeInTheDocument()
      expect(within(article).queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
      expect(container.querySelector('audio')).not.toBeInTheDocument()
      expect(consoleError).not.toHaveBeenCalled()
    })
  })

  describe('sidebar links', () => {
    const withPodcastId = (podcastId: string) => {
      const [podcast, episode] = podcastDetails.results
      const id = Number(podcastId)
      server.use(
        http.get(LOOKUP, () =>
          HttpResponse.json({
            resultCount: 2,
            results: [
              { ...podcast, collectionId: id, trackId: id },
              { ...episode, collectionId: id },
            ],
          }),
        ),
      )
    }

    const sidebarLinks = (sidebar: HTMLElement, name: string, artist: string) => ({
      image: within(sidebar).getByRole('img', { name }).closest('a') as HTMLElement,
      title: within(within(sidebar).getByRole('heading', { name })).getByRole('link'),
      author: within(sidebar).getByRole('link', { name: `by ${artist}` }),
    })

    it.each([
      ['listed', LISTED_ID, 'The Joe Budden Podcast', 'The Joe Budden Network'],
      ['unlisted', PODCAST_ID, 'Switched on Pop', 'Vulture'],
    ])('links image, title and author to the %s podcast', async (_kind, id, name, artist) => {
      withPodcastId(id)
      renderAt(episodePath(id))
      await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })

      const links = sidebarLinks(screen.getByRole('complementary'), name, artist)

      expect(Object.values(links)).toHaveLength(3)
      for (const link of Object.values(links)) {
        expect(link).toHaveAttribute('href', `/podcast/${id}`)
      }
    })

    it.each([
      ['image', LISTED_ID],
      ['title', LISTED_ID],
      ['author', LISTED_ID],
      ['image', PODCAST_ID],
      ['title', PODCAST_ID],
      ['author', PODCAST_ID],
    ] as const)(
      'goes to the podcast page from the %s link (%s) keeping the sidebar',
      async (which, id) => {
        const listed = id === LISTED_ID
        withPodcastId(id)
        const user = userEvent.setup()
        renderAt(episodePath(id))
        await screen.findByRole('heading', { level: 1, name: EPISODE_TITLE })
        const sidebar = screen.getByRole('complementary')
        const links = sidebarLinks(
          sidebar,
          listed ? 'The Joe Budden Podcast' : 'Switched on Pop',
          listed ? 'The Joe Budden Network' : 'Vulture',
        )

        await user.click(links[which])

        expect(await screen.findByText(/^Episodes: \d+$/)).toBeInTheDocument()
        expect(
          screen.queryByRole('heading', { level: 1, name: EPISODE_TITLE }),
        ).not.toBeInTheDocument()
        expect(screen.getByRole('complementary')).toBe(sidebar)
      },
    )
  })
})
