import type { QueryClient } from '@tanstack/react-query'
import type { Params } from 'react-router'

import { NotFoundError } from '../../../shared/api/NotFoundError'

import { findEpisode } from './findEpisode'
import { podcastDetailQuery } from './podcastDetailQuery'

// Validates the episode against the detail (already requested and cached by the layout, so no
// extra request). Logs once here, not in a component effect, and renders via the route errorElement.
export const episodeLoader = async (queryClient: QueryClient, { podcastId, episodeId }: Params) => {
  if (!podcastId || !episodeId) {
    throw new Error('Missing podcastId or episodeId route params')
  }
  const detail = await queryClient.query(podcastDetailQuery(podcastId))
  if (!findEpisode(detail, episodeId)) {
    console.error('Episode not found:', { podcastId, episodeId })
    throw new NotFoundError('Episode not found')
  }
  return null
}
