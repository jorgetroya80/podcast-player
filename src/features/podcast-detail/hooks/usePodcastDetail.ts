import { useQuery } from '@tanstack/react-query'

import { podcastDetailQuery } from '../api/podcastDetailQuery'

export const usePodcastDetail = (id: string) => {
  const { data, isPending } = useQuery({ ...podcastDetailQuery(id), throwOnError: true })

  return { detail: data, isPending }
}
