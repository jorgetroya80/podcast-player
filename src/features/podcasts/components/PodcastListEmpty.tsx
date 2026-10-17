import styles from './PodcastListEmpty.module.css'

type PodcastListEmptyProps = { query?: string }

const PodcastListEmpty = ({ query = '' }: PodcastListEmptyProps) => {
  const message = query.trim()
    ? `No podcasts found by "${query.trim()}"`
    : 'No podcasts available right now'

  return <p className={styles.message}>{message}</p>
}

export default PodcastListEmpty
