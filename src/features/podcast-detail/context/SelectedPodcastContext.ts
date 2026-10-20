import { createContext, use } from 'react'

import type { Podcast, PodcastDetail } from '../../../shared/types'

export type SelectedPodcast = Pick<Podcast, 'id' | 'name' | 'artist' | 'image'> & {
  description?: string
}

export type SelectedPodcastState = {
  podcastId: string // from the URL, always present
  podcast?: SelectedPodcast // undefined when neither the list nor the detail has it
  detail: PodcastDetail // EMPTY_PODCAST_DETAIL while pending
}

export const SelectedPodcastContext = createContext<SelectedPodcastState | null>(null)

export const useSelectedPodcast = (): SelectedPodcastState => {
  const state = use(SelectedPodcastContext)
  if (!state) throw new Error('useSelectedPodcast must be used inside SelectedPodcastProvider')

  return state
}
