import PodcastGrid from './PodcastGrid'
import styles from './PodcastListSkeleton.module.css'

const PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index)

const PodcastListSkeleton = () => {
  return (
    <div role="status" aria-busy="true" aria-label="Loading podcasts">
      <PodcastGrid>
        {PLACEHOLDERS.map((key) => (
          <div key={key} data-testid="podcast-skeleton" className={styles.placeholder} />
        ))}
      </PodcastGrid>
    </div>
  )
}

export default PodcastListSkeleton
