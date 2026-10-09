import { Outlet } from 'react-router'

import Header from '../../shared/components/Header'
import RouteLoadingIndicator from '../../shared/components/RouteLoadingIndicator'

const AppLayout = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <RouteLoadingIndicator />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
