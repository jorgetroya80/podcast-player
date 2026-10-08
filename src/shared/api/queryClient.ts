import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'

export const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_DAY_MS,
        gcTime: ONE_DAY_MS,
      },
    },
  })

export const queryClient = createQueryClient()

export const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})
