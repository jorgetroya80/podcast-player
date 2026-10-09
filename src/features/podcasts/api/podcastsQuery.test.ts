import { http, HttpResponse } from 'msw'

import { TOP_PODCASTS_URL } from '../../../shared/api/config'
import { createQueryClient, ONE_DAY_MS } from '../../../shared/api/queryClient'
import podcastList from '../../../test/mocks/podcastList.json'
import { server } from '../../../test/mocks/server'

import { podcastsQuery } from './podcastsQuery'

describe('podcastsQuery', () => {
  it('fetches and maps the top podcasts', async () => {
    const podcasts = await createQueryClient().query(podcastsQuery)

    expect(podcasts).toHaveLength(2)
    expect(podcasts[0]).toMatchObject({ id: '1535809341', name: 'The Joe Budden Podcast' })
  })

  describe('24 h cache', () => {
    let requests: number

    beforeEach(() => {
      requests = 0
      server.use(
        http.get(TOP_PODCASTS_URL, () => {
          requests++
          return HttpResponse.json(podcastList)
        }),
      )
      vi.useFakeTimers({ toFake: ['Date'] })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not request again before 24 h', async () => {
      const client = createQueryClient()
      await client.query(podcastsQuery)

      vi.setSystemTime(Date.now() + ONE_DAY_MS - 1000)
      await client.query(podcastsQuery)

      expect(requests).toBe(1)
    })

    it('requests again after 24 h', async () => {
      const client = createQueryClient()
      await client.query(podcastsQuery)

      vi.setSystemTime(Date.now() + ONE_DAY_MS + 1000)
      await client.query(podcastsQuery)

      expect(requests).toBe(2)
    })
  })
})
