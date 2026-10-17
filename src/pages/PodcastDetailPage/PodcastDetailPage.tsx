import {
  EpisodeCount,
  EpisodeListEmpty,
  EpisodeTable,
  usePodcastDetail,
} from '../../features/podcast-detail'
import { useRequiredParam } from '../../shared/hooks/useRequiredParam'

import styles from './PodcastDetailPage.module.css'

const PodcastDetailPage = () => {
  const podcastId = useRequiredParam('podcastId')
  const { detail } = usePodcastDetail(podcastId)
  const { episodeCount, episodes } = detail

  return (
    <div className={styles.page}>
      <EpisodeCount count={episodeCount} />
      {episodes.length === 0 ? (
        <EpisodeListEmpty />
      ) : (
        <EpisodeTable podcastId={podcastId} episodes={episodes} />
      )}
    </div>
  )
}

export default PodcastDetailPage
