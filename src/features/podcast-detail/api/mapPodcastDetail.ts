import type { Episode, PodcastDetail } from '../../../shared/types'
import { PodcastNotFoundError } from './PodcastNotFoundError'
import type { LookupEpisode, LookupPodcast, PodcastLookupResponse } from './types'

const isPodcast = (result: LookupPodcast | LookupEpisode): result is LookupPodcast =>
  result.kind === 'podcast'

const isEpisode = (result: LookupPodcast | LookupEpisode): result is LookupEpisode =>
  result.kind === 'podcast-episode'

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
  const podcast = results.find(isPodcast)

  if (!podcast) throw new PodcastNotFoundError()

  return {
    id: String(podcast.collectionId),
    name: podcast.collectionName,
    artist: podcast.artistName,
    image: podcast.artworkUrl600,
    episodeCount: podcast.trackCount,
    episodes: results.filter(isEpisode).map(mapEpisode),
  }
}

export { mapPodcastDetail }
