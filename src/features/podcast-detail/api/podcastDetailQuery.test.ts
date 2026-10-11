import { http, HttpResponse } from 'msw'

import { createQueryClient, ONE_DAY_MS } from '../../../shared/api/queryClient'
import { HttpError } from '../../../shared/api/HttpError'
import { NotFoundError } from '../../../shared/api/NotFoundError'
import podcastDetails from '../../../test/mocks/podcastDetails.json'
import { server } from '../../../test/mocks/server'

import { podcastDetailQuery } from './podcastDetailQuery'

const LOOKUP_URL = 'https://itunes.apple.com/lookup'

describe('podcastDetailQuery', () => {
  let requestUrls: URL[]

  beforeEach(() => {
    requestUrls = []
    server.use(
      http.get(LOOKUP_URL, ({ request }) => {
        requestUrls.push(new URL(request.url))
        return HttpResponse.json(podcastDetails)
      }),
    )
  })

  it('fetches and maps the podcast detail', async () => {
    const detail = await createQueryClient().query(podcastDetailQuery('934552872'))

    expect(detail).toMatchObject({ id: '934552872', name: 'Switched on Pop' })
    expect(detail?.episodes).toHaveLength(1)
  })

  it('sends the given id in the request', async () => {
    await createQueryClient().query(podcastDetailQuery('123'))

    expect(requestUrls).toHaveLength(1)
    expect(requestUrls[0]?.searchParams.get('id')).toBe('123')
  })

  it('does not let the id inject extra query parameters', async () => {
    await createQueryClient().query(podcastDetailQuery('1&limit=500'))

    expect(requestUrls).toHaveLength(1)
    expect(requestUrls[0]?.searchParams.get('id')).toBe('1&limit=500')
    expect(requestUrls[0]?.searchParams.get('limit')).toBe('20')
  })

  it('uses a key per id', async () => {
    const client = createQueryClient()

    expect(podcastDetailQuery('1').queryKey).toEqual(['podcast', '1'])

    await client.query(podcastDetailQuery('1'))
    await client.query(podcastDetailQuery('2'))

    expect(requestUrls.map((url) => url.searchParams.get('id'))).toEqual(['1', '2'])
  })

  describe('24 h cache', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not request again before 24 h', async () => {
      const client = createQueryClient()
      await client.query(podcastDetailQuery('1'))

      vi.setSystemTime(Date.now() + ONE_DAY_MS - 1000)
      await client.query(podcastDetailQuery('1'))

      expect(requestUrls).toHaveLength(1)
    })

    it('requests again after 24 h', async () => {
      const client = createQueryClient()
      await client.query(podcastDetailQuery('1'))

      vi.setSystemTime(Date.now() + ONE_DAY_MS + 1000)
      await client.query(podcastDetailQuery('1'))

      expect(requestUrls).toHaveLength(2)
    })
  })

  describe('errors', () => {
    let consoleError: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleError.mockRestore()
    })

    it.each([500, 503])('rejects with HttpError status %i', async (status) => {
      server.use(http.get(LOOKUP_URL, () => new HttpResponse(null, { status })))

      const result = createQueryClient().query(podcastDetailQuery('1'))

      await expect(result).rejects.toBeInstanceOf(HttpError)
      await expect(result).rejects.toMatchObject({ status })
      expect(consoleError).toHaveBeenCalled()
    })

    it('rejects with a NotFoundError when iTunes answers 400 for an invalid id', async () => {
      server.use(http.get(LOOKUP_URL, () => new HttpResponse(null, { status: 400 })))

      const result = createQueryClient().query(podcastDetailQuery('abc'))

      await expect(result).rejects.toBeInstanceOf(NotFoundError)
      await expect(result).rejects.toThrow('Podcast not found')
    })

    it('resolves to null, without logging, when there are no results', async () => {
      server.use(http.get(LOOKUP_URL, () => HttpResponse.json({ resultCount: 0, results: [] })))

      await expect(createQueryClient().query(podcastDetailQuery('1'))).resolves.toBeNull()
      expect(consoleError).not.toHaveBeenCalled()
    })
  })
})
