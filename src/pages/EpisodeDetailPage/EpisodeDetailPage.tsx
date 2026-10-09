import { useParams } from 'react-router'

import { findEpisode, usePodcastDetail } from '../../features/podcast-detail'
import { formatDate } from '../../shared/utils/formatDate'
import { formatDuration } from '../../shared/utils/formatDuration'

const EpisodeDetailPage = () => {
  const { podcastId = '', episodeId = '' } = useParams()
  const { detail } = usePodcastDetail(podcastId)
  const episode = findEpisode(detail, episodeId)

  // The route loader guarantees the episode exists.
  if (!episode) return null

  const duration = formatDuration(episode.durationMs)

  return (
    <article className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{episode.title}</h1>
      <p className="text-sm text-gray-600">
        <span>Released: {formatDate(episode.releasedAt)}</span>
        {duration && (
          <>
            <span aria-hidden="true"> · </span>
            <span>Duration: {duration}</span>
          </>
        )}
      </p>
    </article>
  )
}

export default EpisodeDetailPage
