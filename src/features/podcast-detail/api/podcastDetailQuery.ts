import { queryOptions } from '@tanstack/react-query'

import { podcastDetailUrl } from '../../../shared/api/config'
import { HttpError } from '../../../shared/api/HttpError'
import { getJson } from '../../../shared/api/httpClient'

import { mapPodcastDetail } from './mapPodcastDetail'
import { PodcastNotFoundError } from './PodcastNotFoundError'
import type { PodcastLookupResponse } from './types'

const INVALID_ID_STATUS = 400

const fetchPodcastDetail = async (id: string) => {
  try {
    return mapPodcastDetail(await getJson<PodcastLookupResponse>(podcastDetailUrl(id)))
  } catch (error) {
    if (error instanceof HttpError && error.status === INVALID_ID_STATUS) {
      throw new PodcastNotFoundError()
    }
    throw error
  }
}

export const podcastDetailQuery = (id: string) =>
  queryOptions({
    queryKey: ['podcast', id],
    queryFn: () => fetchPodcastDetail(id),
  })
