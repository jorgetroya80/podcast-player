import type { PodcastDetail } from '../../../shared/types'

// Null object: the detail of a podcast iTunes does not know. Callers need no null checks.
export const EMPTY_PODCAST_DETAIL: PodcastDetail = Object.freeze({
  episodeCount: 0,
  episodes: Object.freeze([]) as unknown as PodcastDetail['episodes'],
})
