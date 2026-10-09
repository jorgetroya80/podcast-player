import { isRouteErrorResponse, useRouteError } from 'react-router'

import { NotFoundError } from '../api/NotFoundError'

const getMessage = (error: unknown) => {
  if (error instanceof NotFoundError) return `${error.message}.`
  if (isRouteErrorResponse(error) && error.status === 404) return 'Page not found.'
  return 'Something went wrong. Please try again later.'
}

const RouteError = () => {
  const error = useRouteError()

  return (
    <div role="alert" className="p-4 text-center">
      <h1 className="text-lg font-bold">Error</h1>
      <p>{getMessage(error)}</p>
    </div>
  )
}

export default RouteError
