import { useParams } from 'react-router'

import { EpisodeDescription, EpisodePlayer } from '../../features/episode-player'
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
    <article className="flex flex-col gap-2 rounded border border-gray-200 px-4 py-6 shadow-sm">
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
      <EpisodeDescription html={episode.description} />
      <div className="mt-8">
        <EpisodePlayer title={episode.title} src={episode.audioUrl} />
      </div>
    </article>
  )
}

export default EpisodeDetailPage
