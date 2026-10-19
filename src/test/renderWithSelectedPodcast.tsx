import type { ReactElement } from 'react'

import { SelectedPodcastProvider, type SelectedPodcastState } from '../features/podcast-detail'
import type { PodcastDetail } from '../shared/types'
import { renderWithProviders, type RenderOptions } from './renderWithProviders'

const sampleInfo = { id: '42', name: 'Serial', artist: 'Sarah Koenig', image: 'serial.png' }

const sampleDetail: PodcastDetail = {
  info: sampleInfo,
  episodeCount: 1,
  episodes: [{ id: '7', title: 'Pilot', releasedAt: '2024-03-05T10:00:00Z', durationMs: 135_000 }],
}

const sampleSelectedPodcast: SelectedPodcastState = {
  podcastId: '42',
  podcast: { ...sampleInfo, description: 'A podcast about one story.' },
  detail: sampleDetail,
}

export const renderWithSelectedPodcast = (
  ui: ReactElement,
  state: Partial<SelectedPodcastState> = {},
  options: RenderOptions = {},
) =>
  renderWithProviders(
    <SelectedPodcastProvider value={{ ...sampleSelectedPodcast, ...state }}>
      {ui}
    </SelectedPodcastProvider>,
    options,
  )
