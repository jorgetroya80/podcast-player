import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router'

import {
  EpisodeTableSkeleton,
  PodcastSidebar,
  usePodcastDetail,
} from '../../features/podcast-detail'
import { podcastsQuery } from '../../features/podcasts'

const PodcastLayout = () => {
  const { podcastId = '' } = useParams()
  const { detail, isPending } = usePodcastDetail(podcastId)
  const { data: podcasts } = useQuery({ ...podcastsQuery, throwOnError: false })
  const listed = podcasts?.find((podcast) => podcast.id === podcastId)

  // The cached list item is the source of truth; the detail only covers podcasts outside it.
  const sidebar = listed
    ? { ...listed, description: listed.summary }
    : detail && { ...detail, description: undefined }

  return (
    <div className="flex flex-col gap-6 p-4 md:flex-row md:items-start">
      {sidebar && (
        <div className="md:w-72 md:shrink-0 lg:w-80">
          <PodcastSidebar
            id={sidebar.id}
            name={sidebar.name}
            artist={sidebar.artist}
            image={sidebar.image}
            description={sidebar.description}
          />
        </div>
      )}
      <div className="min-w-0 flex-1">{isPending ? <EpisodeTableSkeleton /> : <Outlet />}</div>
    </div>
  )
}

export default PodcastLayout
