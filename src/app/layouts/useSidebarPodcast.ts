import { useQuery } from '@tanstack/react-query'

import { usePodcastDetail } from '../../features/podcast-detail'
import { podcastsQuery, type Podcast } from '../../features/podcasts'

export type SidebarPodcast = Pick<Podcast, 'id' | 'name' | 'artist' | 'image'> & {
  description?: string
}

/**
 * Data for the podcast sidebar. The cached list item is the source of truth (it also carries
 * the description); the detail only covers podcasts outside the list, without description.
 * A failing list never breaks the page, so its errors are not thrown.
 */
export const useSidebarPodcast = (podcastId: string): SidebarPodcast | undefined => {
  const { data: podcasts } = useQuery({ ...podcastsQuery, throwOnError: false })
  const { detail } = usePodcastDetail(podcastId)
  const listed = podcasts?.find((podcast) => podcast.id === podcastId)

  if (listed) {
    const { id, name, artist, image, summary } = listed
    return { id, name, artist, image, description: summary }
  }
  if (detail) {
    const { id, name, artist, image } = detail
    return { id, name, artist, image }
  }
  return undefined
}
