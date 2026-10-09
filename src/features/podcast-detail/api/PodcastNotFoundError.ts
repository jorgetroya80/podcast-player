export class PodcastNotFoundError extends Error {
  constructor() {
    super('Podcast not found')
    this.name = 'PodcastNotFoundError'
  }
}
