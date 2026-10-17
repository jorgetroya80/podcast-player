import { Link } from 'react-router'

import type { Podcast } from '../../../shared/types'

import styles from './PodcastCard.module.css'

type PodcastCardProps = Pick<Podcast, 'id' | 'name' | 'artist' | 'image'>

const PodcastCard = ({ id, name, artist, image }: PodcastCardProps) => {
  return (
    <Link to={`/podcast/${id}`} className={styles.card}>
      <img src={image} alt={name} width={96} height={96} className={styles.image} />
      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.artist}>Author: {artist}</p>
      </div>
    </Link>
  )
}

export default PodcastCard
