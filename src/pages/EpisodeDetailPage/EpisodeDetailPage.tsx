import { useLoaderData } from 'react-router'

import { EpisodeDescription, EpisodePlayer } from '../../features/episode-detail'
import type { Episode } from '../../shared/types'

const EpisodeDetailPage = () => {
  // The route loader resolves to the episode it validated: one lookup per navigation.
  const episode = useLoaderData<Episode>()

  return (
    <article className="flex flex-col gap-2 rounded border border-gray-200 px-4 py-6 shadow-sm">
      <h1 className="text-2xl font-bold">{episode.title}</h1>
      <EpisodeDescription html={episode.description} />
      <div className="mt-8">
        <EpisodePlayer title={episode.title} src={episode.audioUrl} />
      </div>
    </article>
  )
}

export default EpisodeDetailPage
