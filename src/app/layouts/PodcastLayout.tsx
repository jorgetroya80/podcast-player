import { Outlet, useParams } from 'react-router'

import {
  EpisodeTableSkeleton,
  PodcastSidebar,
  usePodcastDetail,
} from '../../features/podcast-detail'
import { useSidebarPodcast } from './useSidebarPodcast'

const PodcastLayout = () => {
  const { podcastId = '' } = useParams()
  const sidebar = useSidebarPodcast(podcastId)
  const { isPending } = usePodcastDetail(podcastId)

  return (
    <div className="flex flex-col gap-6 p-4 md:flex-row md:items-start">
      {sidebar && (
        <div className="md:w-72 md:shrink-0 lg:w-80">
          <PodcastSidebar {...sidebar} />
        </div>
      )}
      <div className="min-w-0 flex-1">{isPending ? <EpisodeTableSkeleton /> : <Outlet />}</div>
    </div>
  )
}

export default PodcastLayout
