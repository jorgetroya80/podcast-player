const PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index)

const EpisodeTableSkeleton = () => {
  return (
    <div role="status" aria-busy="true" aria-label="Loading episodes">
      <ul className="flex flex-col gap-2">
        {PLACEHOLDERS.map((key) => (
          <li
            key={key}
            data-testid="episode-skeleton"
            className="h-10 animate-pulse rounded border border-gray-200 bg-gray-100"
          />
        ))}
      </ul>
    </div>
  )
}

export default EpisodeTableSkeleton
