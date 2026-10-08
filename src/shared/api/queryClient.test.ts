import { createQueryClient, ONE_DAY_MS } from './queryClient'

describe('createQueryClient', () => {
  it('keeps data fresh and cached for 24 hours', () => {
    const queries = createQueryClient().getDefaultOptions().queries

    expect(queries?.staleTime).toBe(ONE_DAY_MS)
    expect(queries?.gcTime).toBe(ONE_DAY_MS)
  })
})
