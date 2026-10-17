import { useLoaderData } from 'react-router'

import { EpisodeDescription, EpisodePlayer } from '../../features/episode-detail'
import type { Episode } from '../../shared/types'

import styles from './EpisodeDetailPage.module.css'

const EpisodeDetailPage = () => {
  // The route loader resolves to the episode it validated: one lookup per navigation.
  const episode = useLoaderData<Episode>()

  return (
    <article className={styles.episode}>
      <h1 className={styles.title}>{episode.title}</h1>
      <EpisodeDescription html={episode.description} />
      <div className={styles.player}>
        <EpisodePlayer title={episode.title} src={episode.audioUrl} />
      </div>
    </article>
  )
}

export default EpisodeDetailPage
