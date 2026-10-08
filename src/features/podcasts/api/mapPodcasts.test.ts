import podcastList from '../../../test/mocks/podcastList.json'
import { mapPodcasts } from './mapPodcasts'

describe('mapPodcasts', () => {
  it('maps feed entries to podcasts', () => {
    const podcasts = mapPodcasts(podcastList)

    expect(podcasts).toHaveLength(2)
    expect(podcasts[0]).toMatchObject({
      id: '1535809341',
      name: 'The Joe Budden Podcast',
      artist: 'The Joe Budden Network',
    })
    expect(podcasts[0].image).toMatch(/170x170bb\.png$/)
    expect(podcasts[0].summary).toMatch(/^Tune into Joe Budden/)
  })
})