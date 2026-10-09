import { NotFoundError } from '../../../shared/api/NotFoundError'

export class PodcastNotFoundError extends NotFoundError {
  constructor() {
    super('Podcast not found')
    this.name = 'PodcastNotFoundError'
  }
}
