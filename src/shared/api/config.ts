const PODCASTS_LIST_LIMIT = 100
const PODCASTS_LIST_GENRE = 1310
const PODCASTS_DETAIL_LIMIT = 20

export const TOP_PODCASTS_URL = `https://itunes.apple.com/us/rss/toppodcasts/limit=${PODCASTS_LIST_LIMIT}/genre=${PODCASTS_LIST_GENRE}/json`

export const podcastDetailUrl = (id: string) =>
  `https://itunes.apple.com/lookup?id=${id}&media=podcast&entity=podcastEpisode&limit=${PODCASTS_DETAIL_LIMIT}`

