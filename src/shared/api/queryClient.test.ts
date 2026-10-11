import { CACHE_BUSTER, createQueryClient, ONE_DAY_MS } from './queryClient'

describe('createQueryClient', () => {
  it('keeps data fresh and cached for 24 hours', () => {
    const queries = createQueryClient().getDefaultOptions().queries

    expect(queries?.staleTime).toBe(ONE_DAY_MS)
    expect(queries?.gcTime).toBe(ONE_DAY_MS)
  })

  it('does not retry failed queries, so errors reach the user at once', () => {
    expect(createQueryClient().getDefaultOptions().queries?.retry).toBe(false)
  })
})

describe('CACHE_BUSTER', () => {
  it('is a non-empty string', () => {
    expect(CACHE_BUSTER).not.toBe('')
  })
})

describe('query error logging', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs a failed query once, with its key and the error', async () => {
    const error = new Error('boom')

    await createQueryClient()
      .query({
        queryKey: ['failing'],
        queryFn: () => Promise.reject(error),
      })
      .catch(() => undefined)

    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith('Query failed:', ['failing'], error)
  })

  it('does not log a successful query', async () => {
    await createQueryClient().query({ queryKey: ['ok'], queryFn: () => Promise.resolve('fine') })

    expect(errorSpy).not.toHaveBeenCalled()
  })
})
