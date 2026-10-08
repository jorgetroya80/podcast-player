export type PodcastEntry = {
  id: { attributes: { 'im:id': string } }
  'im:name': { label: string }
  'im:artist': { label: string }
  'im:image': { label: string; attributes: { height: string } }[]
  summary: { label: string }
}

export type TopPodcastsResponse = {
  feed: { entry: PodcastEntry[] }
}