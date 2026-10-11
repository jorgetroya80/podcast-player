import {
  EpisodeCount,
  EpisodeListEmpty,
  EpisodeTable,
  usePodcastDetail,
} from '../../features/podcast-detail'
import { useRequiredParam } from '../../shared/hooks/useRequiredParam'

const PodcastDetailPage = () => {
  const podcastId = useRequiredParam('podcastId')
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
