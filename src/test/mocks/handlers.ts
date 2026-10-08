import { http, HttpResponse } from 'msw'

import podcastDetails from './podcastDetails.json'
import podcastList from './podcastList.json'

export const handlers = [
  http.get('https://itunes.apple.com/us/rss/toppodcasts/*', () => HttpResponse.json(podcastList)),
  http.get('https://itunes.apple.com/lookup', () => HttpResponse.json(podcastDetails)),
]
