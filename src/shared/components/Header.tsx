import { Link } from 'react-router'

const Header = () => {
  return (
    <header className="border-b border-gray-200 p-4 text-blue-500">
      <Link to="/" className="text-lg font-bold">
        Podcaster
      </Link>
    </header>
  )
}

export default Header
