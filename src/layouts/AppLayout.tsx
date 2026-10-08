import { Outlet } from 'react-router'

const AppLayout = () => {
  return (
    <div>
      <header>Header</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout