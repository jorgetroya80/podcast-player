import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { createTestQueryClient } from '../../../test/renderWithProviders'
import { usePodcasts } from './usePodcasts'

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = createTestQueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('usePodcasts', () => {
  it('starts pending with an empty list, then returns the podcasts', async () => {
    const { result } = renderHook(() => usePodcasts(), { wrapper })

    expect(result.current.isPending).toBe(true)
    expect(result.current.podcasts).toEqual([])

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.podcasts).toHaveLength(2)
  })
})
