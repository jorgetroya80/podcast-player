import { useParams } from 'react-router'

import {
  EpisodeCount,
  EpisodeListEmpty,
  EpisodeTable,
  usePodcastDetail,
} from '../../features/podcast-detail'

const PodcastDetailPage = () => {
  const { podcastId = '' } = useParams()
  const { detail } = usePodcastDetail(podcastId)
  const count = detail?.episodeCount ?? 0
  const episodes = detail?.episodes ?? []

  return (
    <div className="flex flex-col gap-6">
      <EpisodeCount count={count} />
      {episodes.length === 0 ? (
        <EpisodeListEmpty />
      ) : (
        <EpisodeTable podcastId={podcastId} episodes={episodes} />
      )}
    </div>
  )
}

export default PodcastDetailPage
