import {
  EpisodeCount,
  EpisodeListEmpty,
  EpisodeTable,
  useSelectedPodcast,
} from '../../features/podcast-detail'

import styles from './PodcastDetailPage.module.css'

const PodcastDetailPage = () => {
  const { episodeCount, episodes } = useSelectedPodcast().detail

  return (
    <div className={styles.page}>
      <EpisodeCount count={episodeCount} />
      {episodes.length === 0 ? <EpisodeListEmpty /> : <EpisodeTable episodes={episodes} />}
    </div>
  )
}

export default PodcastDetailPage
