import { Link } from 'react-router'

import type { Podcast } from '../../../shared/types'

import styles from './PodcastSidebar.module.css'

type PodcastSidebarProps = Pick<Podcast, 'id' | 'name' | 'artist' | 'image'> & {
  description?: string
}

const PodcastSidebar = ({ id, name, artist, image, description }: PodcastSidebarProps) => {
  const to = `/podcast/${id}`

  return (
    <aside className={styles.sidebar}>
      <Link to={to} className={styles.imageLink}>
        <img src={image} alt={name} width={170} height={170} className={styles.image} />
      </Link>
      <div className={styles.section}>
        <h2 className={styles.name}>
          <Link to={to}>{name}</Link>
        </h2>
        <p className={styles.artist}>
          <Link to={to}>by {artist}</Link>
        </p>
      </div>
      {description ? (
        <div className={styles.section}>
          <h3 className={styles.descriptionTitle}>Description</h3>
          <p className={styles.description}>{description}</p>
        </div>
      ) : null}
    </aside>
  )
}

export default PodcastSidebar
