import type { LookupEpisode, LookupPodcast, PodcastLookupResponse } from './types'
import { EMPTY_PODCAST_DETAIL } from './emptyPodcastDetail'
import { mapPodcastDetail } from './mapPodcastDetail'
import podcastDetails from '../../../test/mocks/podcastDetails.json'

const response = podcastDetails as unknown as PodcastLookupResponse

describe('mapPodcastDetail', () => {
  it('maps the podcast and its episodes', () => {
    const detail = mapPodcastDetail(response)

    expect(detail).toMatchObject({
      info: { id: '934552872', name: 'Switched on Pop', artist: 'Vulture' },
      episodeCount: 556,
    })
    expect(detail.info?.image).toBeTruthy()
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

  it('maps description and audioUrl when present', () => {
    const [, episode] = response.results as [LookupPodcast, LookupEpisode]
    const detail = mapPodcastDetail(response)

    expect(detail.episodes[0].description).toBe(episode.description)
    expect(detail.episodes[0].audioUrl).toBe(episode.episodeUrl)
    expect(detail.episodes[0].description).toBeTruthy()
    expect(detail.episodes[0].audioUrl).toBeTruthy()
  })

  it('leaves description undefined when the episode has no description field', () => {
    const [podcast, episode] = response.results as [LookupPodcast, LookupEpisode]

    const detail = mapPodcastDetail({
      results: [podcast, { ...episode, description: undefined }],
    })

    expect(detail.episodes[0].description).toBeUndefined()
  })

  it('leaves audioUrl undefined when the episode has no episodeUrl field', () => {
    const [podcast, episode] = response.results as [LookupPodcast, LookupEpisode]

    const detail = mapPodcastDetail({
      results: [podcast, { ...episode, episodeUrl: undefined }],
    })

    expect(detail.episodes[0].audioUrl).toBeUndefined()
  })

  it('returns an empty episode list when the podcast has no episodes', () => {
    const [podcast] = response.results

    expect(mapPodcastDetail({ results: [podcast] }).episodes).toEqual([])
  })

  it('returns the empty detail when the response has no results', () => {
    expect(mapPodcastDetail({ results: [] })).toBe(EMPTY_PODCAST_DETAIL)
  })

  it('returns the empty detail when no result is a podcast', () => {
    const [, episode] = response.results

    expect(mapPodcastDetail({ results: [episode] })).toBe(EMPTY_PODCAST_DETAIL)
    expect(
      mapPodcastDetail({ results: [{ kind: 'song' }] } as unknown as PodcastLookupResponse),
    ).toBe(EMPTY_PODCAST_DETAIL)
  })
})
