import styles from './EpisodeCount.module.css'

type EpisodeCountProps = { count: number }

const EpisodeCount = ({ count }: EpisodeCountProps) => {
  return <p className={styles.count}>Episodes: {count}</p>
}

export default EpisodeCount
