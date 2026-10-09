import EpisodeRow, { type EpisodeRowData } from './EpisodeRow'

type EpisodeTableProps = { podcastId: string; episodes: EpisodeRowData[] }

const EpisodeTable = ({ podcastId, episodes }: EpisodeTableProps) => {
  return (
    <div className="overflow-x-auto rounded border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Episodes</caption>
        <thead>
          <tr>
            <th scope="col" className="px-4 py-2 font-bold">
              Title
            </th>
            <th scope="col" className="px-4 py-2 font-bold">
              Date
            </th>
            <th scope="col" className="px-4 py-2 font-bold">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <EpisodeRow key={episode.id} podcastId={podcastId} episode={episode} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EpisodeTable
