import { Outlet } from 'react-router'

import { PodcastFilterProvider } from '../../features/podcasts'
import Header from '../../shared/components/Header'
import RouteLoadingIndicator from '../../shared/components/RouteLoadingIndicator'

import styles from './AppLayout.module.css'

const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <RouteLoadingIndicator />
      <main>
        <PodcastFilterProvider>
          <Outlet />
        </PodcastFilterProvider>
      </main>
    </div>
  )
}

export default AppLayout
