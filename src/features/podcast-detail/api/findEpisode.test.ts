import type { PodcastDetail } from '../../../shared/types'
import { findEpisode } from './findEpisode'

const detail: PodcastDetail = {
  id: '1',
  name: 'Podcast',
  artist: 'Artist',
  image: 'img',
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

  it('returns undefined when there is no detail', () => {
    expect(findEpisode(undefined, '10')).toBeUndefined()
    expect(findEpisode(null, '10')).toBeUndefined()
  })
})
