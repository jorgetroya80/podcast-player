import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryCache, QueryClient } from '@tanstack/react-query'

import { logQueryError } from './logQueryError'

export const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const createQueryCache = () => new QueryCache({ onError: logQueryError })

export const createQueryClient = () =>
  new QueryClient({
    queryCache: createQueryCache(),
    defaultOptions: {
      queries: {
        staleTime: ONE_DAY_MS,
        gcTime: ONE_DAY_MS,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })

export const queryClient = createQueryClient()

export const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})
