import { useQuery } from '@tanstack/react-query'

import { EMPTY_PODCAST_DETAIL } from '../api/emptyPodcastDetail'
import { podcastDetailQuery } from '../api/podcastDetailQuery'

export const usePodcastDetail = (id: string) => {
  const { data, isPending } = useQuery({ ...podcastDetailQuery(id), throwOnError: true })

  return { detail: data ?? EMPTY_PODCAST_DETAIL, isPending }
}
