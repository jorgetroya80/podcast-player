import styles from './PodcastFilter.module.css'

type PodcastFilterProps = {
  value: string
  onChange: (value: string) => void
  count?: number | undefined
}

const PodcastFilter = ({ value, onChange, count }: PodcastFilterProps) => {
  return (
    <div role="search" className={styles.filter}>
      {count !== undefined && <span className={styles.count}>{count}</span>}
      <label htmlFor="filter-podcasts" className="sr-only">
        Filter podcasts
      </label>
      <input
        id="filter-podcasts"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter podcasts..."
        className={styles.input}
      />
    </div>
  )
}

export default PodcastFilter
