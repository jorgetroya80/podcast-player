import type { Episode, PodcastDetail } from '../../../shared/types'
import type { LookupEpisode, PodcastLookupResponse } from './types'

function mapEpisode(episode: LookupEpisode): Episode {
  return {
    id: String(episode.trackId),
    title: episode.trackName,
    description: episode.description,
    audioUrl: episode.episodeUrl,
    durationMs: episode.trackTimeMillis,
    releasedAt: episode.releaseDate,
  }
}

function mapPodcastDetail({ results }: PodcastLookupResponse): PodcastDetail {
  const [podcast, ...episodes] = results

  return {
    id: String(podcast.collectionId),
    name: podcast.collectionName,
    artist: podcast.artistName,
    image: podcast.artworkUrl600,
    episodeCount: podcast.trackCount,
    episodes: episodes.map(mapEpisode),
  }
}

export { mapPodcastDetail }