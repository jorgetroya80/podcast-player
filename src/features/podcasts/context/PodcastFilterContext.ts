import { createContext, use } from 'react'

import type { Podcast } from '../../../shared/types'
import { filterPodcasts } from '../utils/filterPodcasts'

export type PodcastFilterState = { query: string; setQuery: (query: string) => void }

// Null default so a consumer outside PodcastFilterProvider fails instead of filtering nothing.
export const PodcastFilterContext = createContext<PodcastFilterState | null>(null)

export const usePodcastFilter = <T extends Pick<Podcast, 'name' | 'artist'>>(podcasts: T[]) => {
  const filter = use(PodcastFilterContext)
  if (!filter) throw new Error('usePodcastFilter must be used inside PodcastFilterProvider')

  return { ...filter, filtered: filterPodcasts(podcasts, filter.query) }
}
