import { useNavigation } from 'react-router'

const RouteLoadingIndicator = () => {
  const navigation = useNavigation()

  if (navigation.state !== 'loading') return null

  return (
    <div role="status" aria-label="Loading" className="fixed top-4 right-4">
      <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  )
}

export default RouteLoadingIndicator
