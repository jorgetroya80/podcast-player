type PodcastListEmptyProps = { query?: string }

const PodcastListEmpty = ({ query = '' }: PodcastListEmptyProps) => {
  const message = query.trim()
    ? `No podcasts found by "${query.trim()}"`
    : 'No podcasts available right now'

  return <p className="py-10 text-center text-gray-500">{message}</p>
}

export default PodcastListEmpty
