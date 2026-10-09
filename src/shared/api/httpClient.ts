import { buildRequestUrl } from './buildRequestUrl'
import { HttpError } from './HttpError'

async function getJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(buildRequestUrl(url))
    if (!response.ok) {
      throw new HttpError(response.status, url)
    }
    return (await response.json()) as T
  } catch (error) {
    console.error('Error fetching JSON:', error)
    throw error
  }
}

export { getJson }
