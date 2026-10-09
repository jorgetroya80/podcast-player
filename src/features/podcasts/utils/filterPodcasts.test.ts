import { filterPodcasts } from './filterPodcasts'

const podcasts = [
  { name: 'The Joe Budden Podcast', artist: 'Joe Budden Network' },
  { name: 'Serial', artist: 'Sarah Koenig' },
]

describe('filterPodcasts', () => {
  it('returns all podcasts for an empty or blank query', () => {
    expect(filterPodcasts(podcasts, '')).toEqual(podcasts)
    expect(filterPodcasts(podcasts, '   ')).toEqual(podcasts)
  })

  it('matches by name ignoring case', () => {
    expect(filterPodcasts(podcasts, 'SERIAL')).toEqual([podcasts[1]])
  })

  it('matches by artist ignoring case', () => {
    expect(filterPodcasts(podcasts, 'koenig')).toEqual([podcasts[1]])
  })

  it('trims the query', () => {
    expect(filterPodcasts(podcasts, '  serial  ')).toEqual([podcasts[1]])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterPodcasts(podcasts, 'zzz')).toEqual([])
  })
})
