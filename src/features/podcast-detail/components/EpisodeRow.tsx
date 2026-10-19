import { Link } from 'react-router'

import { formatDate } from '../../../shared/utils/formatDate'
import { formatDuration } from '../../../shared/utils/formatDuration'
import type { Episode } from '../../../shared/types'
import { useSelectedPodcast } from '../hooks/useSelectedPodcast'

import styles from './EpisodeRow.module.css'

export type EpisodeRowData = Pick<Episode, 'id' | 'title' | 'releasedAt' | 'durationMs'>

type EpisodeRowProps = { episode: EpisodeRowData }

const EpisodeRow = ({ episode }: EpisodeRowProps) => {
  const { podcastId } = useSelectedPodcast()

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <Link to={`/podcast/${podcastId}/episode/${episode.id}`} className={styles.link}>
          {episode.title}
        </Link>
      </td>
      <td className={styles.nowrap}>{formatDate(episode.releasedAt)}</td>
      <td className={styles.nowrap}>{formatDuration(episode.durationMs)}</td>
    </tr>
  )
}

export default EpisodeRow
