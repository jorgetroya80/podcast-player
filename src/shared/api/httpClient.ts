import { buildRequestUrl } from './buildRequestUrl'
import { HttpError } from './HttpError'

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(buildRequestUrl(url))
  if (!response.ok) {
    throw new HttpError(response.status, url)
  }

  return (await response.json()) as T
}

export { getJson }
