import { PodcastList } from '../../features/podcasts'

import styles from './PodcastListPage.module.css'

const PodcastListPage = () => {
  return (
    <div className={styles.page}>
      <PodcastList />
    </div>
  )
}

export default PodcastListPage
