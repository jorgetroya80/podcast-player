import type { Episode, PodcastDetail } from '../../../shared/types'

export const findEpisode = (detail: PodcastDetail, episodeId: string): Episode | undefined =>
  detail.episodes.find((episode) => episode.id === episodeId)
