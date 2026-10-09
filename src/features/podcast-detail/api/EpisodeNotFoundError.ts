import { NotFoundError } from '../../../shared/api/NotFoundError'

export class EpisodeNotFoundError extends NotFoundError {
  constructor() {
    super('Episode not found')
    this.name = 'EpisodeNotFoundError'
  }
}
