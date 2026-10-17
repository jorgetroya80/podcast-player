import styles from './EpisodeTableSkeleton.module.css'

const PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index)

const EpisodeTableSkeleton = () => {
  return (
    <div role="status" aria-busy="true" aria-label="Loading episodes">
      <ul className={styles.list}>
        {PLACEHOLDERS.map((key) => (
          <li key={key} data-testid="episode-skeleton" className={styles.placeholder} />
        ))}
      </ul>
    </div>
  )
}

export default EpisodeTableSkeleton
