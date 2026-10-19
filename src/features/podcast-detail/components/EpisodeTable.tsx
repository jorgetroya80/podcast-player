import EpisodeRow, { type EpisodeRowData } from './EpisodeRow'

import styles from './EpisodeTable.module.css'

type EpisodeTableProps = { episodes: EpisodeRowData[] }

const EpisodeTable = ({ episodes }: EpisodeTableProps) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className="sr-only">Episodes</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.heading}>
              Title
            </th>
            <th scope="col" className={styles.heading}>
              Date
            </th>
            <th scope="col" className={styles.heading}>
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <EpisodeRow key={episode.id} episode={episode} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EpisodeTable
