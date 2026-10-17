import { Link } from 'react-router'

import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Podcaster
      </Link>
    </header>
  )
}

export default Header
