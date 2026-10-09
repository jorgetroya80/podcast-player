import type { LookupEpisode, LookupPodcast, PodcastLookupResponse } from './types'
import { mapPodcastDetail } from './mapPodcastDetail'
import { PodcastNotFoundError } from './PodcastNotFoundError'
import podcastDetails from '../../../test/mocks/podcastDetails.json'

const response = podcastDetails as unknown as PodcastLookupResponse

describe('mapPodcastDetail', () => {
  it('maps the podcast and its episodes', () => {
    const detail = mapPodcastDetail(response)

    expect(detail).toMatchObject({
      id: '934552872',
      name: 'Switched on Pop',
      artist: 'Vulture',
      episodeCount: 556,
    })
    expect(detail.episodes).toHaveLength(1)
    expect(detail.episodes[0]).toMatchObject({
      id: '1000793367564',
      title: 'Has Taylor Swift jumped the shark?',
      durationMs: 2875000,
      releasedAt: '2026-10-06T04:00:00Z',
    })
  })

  it('leaves durationMs undefined when the episode has no trackTimeMillis field', () => {
    const [podcast, episode] = response.results as [LookupPodcast, LookupEpisode]

    const detail = mapPodcastDetail({
      results: [podcast, { ...episode, trackTimeMillis: undefined }],
    })

    expect(detail.episodes[0].durationMs).toBeUndefined()
  })

  it('returns an empty episode list when the podcast has no episodes', () => {
    const [podcast] = response.results

    expect(mapPodcastDetail({ results: [podcast] }).episodes).toEqual([])
  })

  it('throws PodcastNotFoundError when the response has no results', () => {
    expect(() => mapPodcastDetail({ results: [] })).toThrow(PodcastNotFoundError)
  })

  it('throws PodcastNotFoundError when no result is a podcast', () => {
    const [, episode] = response.results

    expect(() => mapPodcastDetail({ results: [episode] })).toThrow(PodcastNotFoundError)
    expect(() =>
      mapPodcastDetail({ results: [{ kind: 'song' }] } as unknown as PodcastLookupResponse),
    ).toThrow(PodcastNotFoundError)
  })
})
