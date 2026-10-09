type EpisodeCountProps = { count: number }

const EpisodeCount = ({ count }: EpisodeCountProps) => {
  return (
    <p className="rounded border border-gray-200 p-4 text-xl font-bold shadow-sm">
      Episodes: {count}
    </p>
  )
}

export default EpisodeCount
