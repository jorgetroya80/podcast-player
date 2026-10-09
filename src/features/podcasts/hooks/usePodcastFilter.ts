import { useState } from 'react'

import type { Podcast } from '../../../shared/types'
import { filterPodcasts } from '../utils/filterPodcasts'

export const usePodcastFilter = <T extends Pick<Podcast, 'name' | 'artist'>>(podcasts: T[]) => {
  const [query, setQuery] = useState('')

  return { query, setQuery, filtered: filterPodcasts(podcasts, query) }
}
