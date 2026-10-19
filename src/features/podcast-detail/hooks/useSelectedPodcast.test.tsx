import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'

import { EMPTY_PODCAST_DETAIL } from '../api/emptyPodcastDetail'
import SelectedPodcastProvider from '../components/SelectedPodcastProvider'
import type { SelectedPodcastState } from '../context/SelectedPodcastContext'
import { useSelectedPodcast } from './useSelectedPodcast'

const state: SelectedPodcastState = {
  podcastId: '42',
  podcast: { id: '42', name: 'Serial', artist: 'Sarah Koenig', image: 'serial.png' },
  detail: EMPTY_PODCAST_DETAIL,
}

describe('useSelectedPodcast', () => {
  it('returns the value of the provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SelectedPodcastProvider value={state}>{children}</SelectedPodcastProvider>
    )

    const { result } = renderHook(() => useSelectedPodcast(), { wrapper })

    expect(result.current).toBe(state)
  })

  it('throws outside SelectedPodcastProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useSelectedPodcast())).toThrow(
      'useSelectedPodcast must be used inside SelectedPodcastProvider',
    )
    consoleError.mockRestore()
  })
})
