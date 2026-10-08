import { podcastDetailUrl, TOP_PODCASTS_URL } from './config'

describe('api - config', () => {
  it('builds the top podcasts URL', () => {
    expect(TOP_PODCASTS_URL).toBe(
      'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
    )
  })

  it('builds the podcast detail URL for an id', () => {
    expect(podcastDetailUrl('934552872')).toBe(
      'https://itunes.apple.com/lookup?id=934552872&media=podcast&entity=podcastEpisode&limit=20',
    )
  })
})
