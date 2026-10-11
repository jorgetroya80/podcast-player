import { http, HttpResponse } from 'msw'

import { server } from '../../test/mocks/server'
import { TOP_PODCASTS_URL } from './config'
import { HttpError } from './HttpError'
import { getJson } from './httpClient'

describe('getJson', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the parsed JSON body', async () => {
    const data = await getJson<{ feed: unknown }>(TOP_PODCASTS_URL)

    expect(data).toHaveProperty('feed')
  })

  it.each([404, 500])(
    'throws an HttpError with status %i when the response is not ok',
    async (status) => {
      server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse(null, { status })))

      const error = await getJson(TOP_PODCASTS_URL).catch((e: unknown) => e)

      expect(error).toBeInstanceOf(HttpError)
      expect(error).toMatchObject({ status })
    },
  )

  it('rejects on a network failure', async () => {
    server.use(http.get(TOP_PODCASTS_URL, () => HttpResponse.error()))

    await expect(getJson(TOP_PODCASTS_URL)).rejects.toThrow()
  })

  it('rejects when the body is not valid JSON', async () => {
    server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse('not json')))

    await expect(getJson(TOP_PODCASTS_URL)).rejects.toThrow()
  })

  it('never logs, whatever the outcome', async () => {
    await getJson(TOP_PODCASTS_URL)
    server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse(null, { status: 500 })))
    await getJson(TOP_PODCASTS_URL).catch(() => undefined)
    server.use(http.get(TOP_PODCASTS_URL, () => HttpResponse.error()))
    await getJson(TOP_PODCASTS_URL).catch(() => undefined)

    expect(errorSpy).not.toHaveBeenCalled()
  })
})
