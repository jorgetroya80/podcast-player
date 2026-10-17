import { Outlet } from 'react-router'

import {
  EpisodeTableSkeleton,
  PodcastSidebar,
  usePodcastDetail,
} from '../../features/podcast-detail'
import { useRequiredParam } from '../../shared/hooks/useRequiredParam'
import { useSidebarPodcast } from './useSidebarPodcast'

import styles from './PodcastLayout.module.css'

const PodcastLayout = () => {
  const podcastId = useRequiredParam('podcastId')
  const sidebar = useSidebarPodcast(podcastId)
  const { isPending } = usePodcastDetail(podcastId)

  return (
    <div className={styles.layout}>
      {sidebar && (
        <div className={styles.sidebar}>
          <PodcastSidebar {...sidebar} />
        </div>
      )}
      <div className={styles.content}>{isPending ? <EpisodeTableSkeleton /> : <Outlet />}</div>
    </div>
  )
}

export default PodcastLayout
