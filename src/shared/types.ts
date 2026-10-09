export type Podcast = {
  id: string // id.attributes['im:id']
  name: string // im:name.label
  artist: string // im:artist.label
  image: string // im:image[2].label (170px)
  summary: string // summary.label
}

export type Episode = {
  id: string // trackId
  title: string // trackName
  description?: string // description (HTML, can be missing). Sanitize before injecting (v0.6)
  audioUrl?: string // episodeUrl (can be missing)
  durationMs?: number // trackTimeMillis (can be missing)
  releasedAt: string // releaseDate (ISO 8601)
}

export type PodcastDetail = {
  id: string // results[0].collectionId
  name: string // results[0].collectionName
  artist: string // results[0].artistName
  image: string // results[0].artworkUrl600
  episodeCount: number // results[0].trackCount (total real, not the 20 downloaded)
  episodes: Episode[] // results[1..] mapped to Episode
}
