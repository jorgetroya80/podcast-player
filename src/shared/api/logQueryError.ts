import type { Query } from '@tanstack/react-query'

export const logQueryError = (error: Error, query: Query<unknown, unknown, unknown>) => {
  console.error('Query failed:', query.queryKey, error)
}
