import { queryOptions } from '@tanstack/react-query'

import { TOP_PODCASTS_URL } from '../../../shared/api/config'
import { getJson } from '../../../shared/api/httpClient'

import { mapPodcasts } from './mapPodcasts'
import type { TopPodcastsResponse } from './types'

export const podcastsQuery = queryOptions({
  queryKey: ['podcasts'],
  queryFn: async () => mapPodcasts(await getJson<TopPodcastsResponse>(TOP_PODCASTS_URL)),
})
