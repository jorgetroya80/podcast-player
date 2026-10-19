import { use } from 'react'

import {
  SelectedPodcastContext,
  type SelectedPodcastState,
} from '../context/SelectedPodcastContext'

export const useSelectedPodcast = (): SelectedPodcastState => {
  const state = use(SelectedPodcastContext)
  if (!state) throw new Error('useSelectedPodcast must be used inside SelectedPodcastProvider')

  return state
}
