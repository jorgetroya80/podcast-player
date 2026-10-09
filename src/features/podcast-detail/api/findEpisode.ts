import type { Episode, PodcastDetail } from '../../../shared/types'

export const findEpisode = (
  detail: PodcastDetail | null | undefined,
  episodeId: string,
): Episode | undefined => detail?.episodes.find((episode) => episode.id === episodeId)
