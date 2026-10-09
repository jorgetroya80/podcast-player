import { useQuery } from '@tanstack/react-query'

import { podcastsQuery } from '../api/podcastsQuery'

export const usePodcasts = () => {
  const { data, isPending } = useQuery({ ...podcastsQuery, throwOnError: true })

  return { podcasts: data ?? [], isPending }
}
