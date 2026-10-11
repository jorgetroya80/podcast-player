import { http, HttpResponse } from 'msw'

import { createQueryClient } from '../../../shared/api/queryClient'
import { HttpError } from '../../../shared/api/HttpError'
import { NotFoundError } from '../../../shared/api/NotFoundError'
import { server } from '../../../test/mocks/server'

import { episodeLoader } from './episodeLoader'

const LOOKUP_URL = 'https://itunes.apple.com/lookup'
const PODCAST_ID = '934552872'
const EPISODE_ID = '1000793367564'

describe('episodeLoader', () => {
  let requests: number
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    requests = 0
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.events.on('request:start', ({ request }) => {
      if (request.url.startsWith(LOOKUP_URL)) requests += 1
    })
  })

  afterEach(() => {
    server.events.removeAllListeners()
    consoleError.mockRestore()
  })

  it('resolves to null, without logging, when the episode exists', async () => {
    const result = episodeLoader(createQueryClient(), {
      podcastId: PODCAST_ID,
      episodeId: EPISODE_ID,
    })

    await expect(result).resolves.toBeNull()
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('logs once and rejects with NotFoundError when the episode does not exist', async () => {
    const result = episodeLoader(createQueryClient(), { podcastId: PODCAST_ID, episodeId: '999' })

    await expect(result).rejects.toBeInstanceOf(NotFoundError)
    await expect(result).rejects.toThrow('Episode not found')
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith('Episode not found:', {
      podcastId: PODCAST_ID,
      episodeId: '999',
    })
  })

  it('treats a detail with no results (empty detail) as episode not found', async () => {
    server.use(http.get(LOOKUP_URL, () => HttpResponse.json({ resultCount: 0, results: [] })))

    const result = episodeLoader(createQueryClient(), { podcastId: PODCAST_ID, episodeId: '1' })

    await expect(result).rejects.toBeInstanceOf(NotFoundError)
    await expect(result).rejects.toThrow('Episode not found')
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith('Episode not found:', {
      podcastId: PODCAST_ID,
      episodeId: '1',
    })
  })

  it.each([
    [{ podcastId: undefined, episodeId: '1' }, 'Missing route param: podcastId'],
    [{ podcastId: '1', episodeId: undefined }, 'Missing route param: episodeId'],
    [{}, 'Missing route param: podcastId'],
  ])(
    'rejects with a plain Error and requests nothing when params are missing %#',
    async (params, message) => {
      const result = episodeLoader(createQueryClient(), params)

      await expect(result).rejects.toThrow(message)
      await expect(result).rejects.not.toBeInstanceOf(NotFoundError)
      expect(requests).toBe(0)
      expect(consoleError).not.toHaveBeenCalled()
    },
  )

  it('propagates the HttpError without the episode-not-found log when the detail fails', async () => {
    server.use(http.get(LOOKUP_URL, () => new HttpResponse(null, { status: 500 })))

    const result = episodeLoader(createQueryClient(), { podcastId: PODCAST_ID, episodeId: '1' })

    await expect(result).rejects.toBeInstanceOf(HttpError)
    await expect(result).rejects.toMatchObject({ status: 500 })
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith('Query failed:', expect.anything(), expect.anything())
    expect(consoleError).not.toHaveBeenCalledWith('Episode not found:', expect.anything())
  })
})
