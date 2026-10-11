import type { PodcastDetail } from '../../../shared/types'
import { EMPTY_PODCAST_DETAIL } from './emptyPodcastDetail'
import { findEpisode } from './findEpisode'

const detail: PodcastDetail = {
  info: { id: '1', name: 'Podcast', artist: 'Artist', image: 'img' },
  episodeCount: 2,
  episodes: [
    { id: '10', title: 'First', releasedAt: '2026-01-01T00:00:00Z' },
    { id: '20', title: 'Second', releasedAt: '2026-01-02T00:00:00Z' },
  ],
}

describe('findEpisode', () => {
  it('returns the episode with the given id', () => {
    expect(findEpisode(detail, '20')?.title).toBe('Second')
  })

  it('returns undefined for an unknown id', () => {
    expect(findEpisode(detail, '99')).toBeUndefined()
  })

  it('returns undefined when the detail is empty', () => {
    expect(findEpisode(EMPTY_PODCAST_DETAIL, '10')).toBeUndefined()
  })
})
