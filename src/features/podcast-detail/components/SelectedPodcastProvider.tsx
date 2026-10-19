import type { ReactNode } from 'react'

import {
  SelectedPodcastContext,
  type SelectedPodcastState,
} from '../context/SelectedPodcastContext'

type SelectedPodcastProviderProps = { value: SelectedPodcastState; children: ReactNode }

const SelectedPodcastProvider = ({ value, children }: SelectedPodcastProviderProps) => {
  return <SelectedPodcastContext value={value}>{children}</SelectedPodcastContext>
}

export default SelectedPodcastProvider
