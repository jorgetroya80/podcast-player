import type { QueryClient } from '@tanstack/react-query'
import type { Params } from 'react-router'

import { NotFoundError } from '../../../shared/api/NotFoundError'
import type { Episode } from '../../../shared/types'
import { requireParam } from '../../../shared/utils/requireParam'

import { findEpisode } from './findEpisode'
import { podcastDetailQuery } from './podcastDetailQuery'

// Finds the episode in the detail (already requested and cached by the layout, so no extra request)
// and returns it for the page to read with useLoaderData. If missing, logs once here (not in a
// component effect) and throws, which renders via the route errorElement.
export const episodeLoader = async (queryClient: QueryClient, params: Params): Promise<Episode> => {
  const podcastId = requireParam(params.podcastId, 'podcastId')
  const episodeId = requireParam(params.episodeId, 'episodeId')
  const detail = await queryClient.query(podcastDetailQuery(podcastId))
  const episode = findEpisode(detail, episodeId)
  if (!episode) {
    console.error('Episode not found:', { podcastId, episodeId })
    throw new NotFoundError('Episode not found')
  }
  return episode
}
