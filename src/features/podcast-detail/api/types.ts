export type LookupPodcast = {
  kind: 'podcast'
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl600: string
  trackCount: number
}

export type LookupEpisode = {
  kind: 'podcast-episode'
  trackId: number
  trackName: string
  description: string
  episodeUrl: string
  trackTimeMillis?: number
  releaseDate: string
}

export type PodcastLookupResponse = {
  results: (LookupPodcast | LookupEpisode)[]
}
