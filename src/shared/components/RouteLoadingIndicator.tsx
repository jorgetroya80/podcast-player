import { useIsFetching } from '@tanstack/react-query'
import { useNavigation } from 'react-router'

import styles from './RouteLoadingIndicator.module.css'

// Covers both the router (pending loaders) and the data the destination screen requests itself.
const RouteLoadingIndicator = () => {
  const navigation = useNavigation()
  const fetching = useIsFetching()

  if (navigation.state !== 'loading' && fetching === 0) return null

  return (
    <div role="status" aria-label="Loading" className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner} />
      </div>
    </div>
  )
}

export default RouteLoadingIndicator
