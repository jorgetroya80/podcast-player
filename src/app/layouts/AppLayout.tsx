import { Outlet } from 'react-router'

import Header from '../../shared/components/Header'
import NavigationIndicator from '../../shared/components/NavigationIndicator'

const AppLayout = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <NavigationIndicator />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
