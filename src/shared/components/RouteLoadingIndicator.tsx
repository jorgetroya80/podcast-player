import { useIsFetching } from '@tanstack/react-query'
import { useNavigation } from 'react-router'

// Covers both the router (pending loaders) and the data the destination screen requests itself.
const RouteLoadingIndicator = () => {
  const navigation = useNavigation()
  const fetching = useIsFetching()

  if (navigation.state !== 'loading' && fetching === 0) return null

  return (
    <div role="status" aria-label="Loading" className="pointer-events-none fixed inset-x-0 top-4">
      <div className="mx-auto flex max-w-7xl justify-end px-4">
        <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    </div>
  )
}

export default RouteLoadingIndicator
