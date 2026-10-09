import { isRouteErrorResponse, useRouteError } from 'react-router'

const RouteError = () => {
  const error = useRouteError()

  const message =
    isRouteErrorResponse(error) && error.status === 404
      ? 'Page not found.'
      : 'Something went wrong. Please try again later.'

  return (
    <div role="alert" className="p-4 text-center">
      <h1 className="text-lg font-bold">Error</h1>
      <p>{message}</p>
    </div>
  )
}

export default RouteError
