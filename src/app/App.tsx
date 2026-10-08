import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import type { createAppRouter } from './router'
import { RouterProvider } from 'react-router/dom'

type AppProps = {
  router: ReturnType<typeof createAppRouter>
  queryClient: QueryClient
}

function App({ router, queryClient }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
