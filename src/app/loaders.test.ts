import { http, HttpResponse } from 'msw'

import { createQueryClient } from '../shared/api/queryClient'
import { server } from '../test/mocks/server'

import { notFoundLoader, podcastLayoutLoader } from './loaders'

const LIST_URL = 'https://itunes.apple.com/us/rss/toppodcasts/*'

describe('podcastLayoutLoader', () => {
  it('resolves with the podcast list when it loads', async () => {
    const list = await podcastLayoutLoader(createQueryClient())

    expect(list).toEqual(expect.any(Array))
    expect(list?.length).toBeGreaterThan(0)
  })

  it('resolves to undefined, without rejecting, when the list fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(http.get(LIST_URL, () => new HttpResponse(null, { status: 500 })))

    await expect(podcastLayoutLoader(createQueryClient())).resolves.toBeUndefined()

    consoleError.mockRestore()
  })
})

describe('notFoundLoader', () => {
  it('throws a 404 Response', () => {
    let thrown: unknown
    try {
      notFoundLoader()
    } catch (error) {
      thrown = error
    }

    expect(thrown).toBeInstanceOf(Response)
    expect((thrown as Response).status).toBe(404)
  })
})
