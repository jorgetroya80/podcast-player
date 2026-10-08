import { createQueryClient } from '../../../shared/api/queryClient'

import { podcastsQuery } from './podcastsQuery'

describe('podcastsQuery', () => {
  it('fetches and maps the top podcasts', async () => {
    const podcasts = await createQueryClient().query(podcastsQuery)

    expect(podcasts).toHaveLength(2)
    expect(podcasts[0]).toMatchObject({ id: '1535809341', name: 'The Joe Budden Podcast' })
  })
})