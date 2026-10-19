import { Outlet } from 'react-router'

import {
  EpisodeTableSkeleton,
  PodcastSidebar,
  SelectedPodcastProvider,
  usePodcastDetail,
} from '../../features/podcast-detail'
import { useRequiredParam } from '../../shared/hooks/useRequiredParam'
import { useSidebarPodcast } from './useSidebarPodcast'

import styles from './PodcastLayout.module.css'

// Resolves the active podcast once (URL + query cache) and shares it with the sidebar and child routes.
const PodcastLayout = () => {
  const podcastId = useRequiredParam('podcastId')
  const podcast = useSidebarPodcast(podcastId)
  const { detail, isPending } = usePodcastDetail(podcastId)

  return (
    <SelectedPodcastProvider value={{ podcastId, podcast, detail }}>
      <div className={styles.layout}>
        {podcast && (
          <div className={styles.sidebar}>
            <PodcastSidebar />
          </div>
        )}
        <div className={styles.content}>{isPending ? <EpisodeTableSkeleton /> : <Outlet />}</div>
      </div>
    </SelectedPodcastProvider>
  )
}

export default PodcastLayout
