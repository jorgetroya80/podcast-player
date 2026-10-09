export class HttpError extends Error {
  readonly status: number

  constructor(status: number, url: string) {
    super(`Request failed with status ${status}: ${url}`)
    this.name = 'HttpError'
    this.status = status
  }
}
