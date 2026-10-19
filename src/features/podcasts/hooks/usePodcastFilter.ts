import { use } from 'react'

import type { Podcast } from '../../../shared/types'
import { PodcastFilterContext } from '../context/PodcastFilterContext'
import { filterPodcasts } from '../utils/filterPodcasts'

export const usePodcastFilter = <T extends Pick<Podcast, 'name' | 'artist'>>(podcasts: T[]) => {
  const filter = use(PodcastFilterContext)
  if (!filter) throw new Error('usePodcastFilter must be used inside PodcastFilterProvider')

  return { ...filter, filtered: filterPodcasts(podcasts, filter.query) }
}
