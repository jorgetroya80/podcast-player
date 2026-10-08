import { http, HttpResponse } from 'msw'

import { server } from '../../test/mocks/server'
import { TOP_PODCASTS_URL } from './config'
import { getJson } from './httpClient'

describe('getJson', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the parsed JSON body', async () => {
    const data = await getJson<{ feed: unknown }>(TOP_PODCASTS_URL)

    expect(data).toHaveProperty('feed')
  })

  it('throws an error when the response is not ok', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse(null, { status: 500 })))

    await expect(getJson(TOP_PODCASTS_URL)).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalled()
  })
})
