type PodcastFilterProps = {
  value: string
  onChange: (value: string) => void
  count: number
}

const PodcastFilter = ({ value, onChange, count }: PodcastFilterProps) => {
  return (
    <div role="search" className="flex items-center justify-end gap-3">
      <span className="rounded bg-blue-500 px-2 py-0.5 text-sm font-bold text-white">{count}</span>
      <label htmlFor="filter-podcasts" className="sr-only">
        Filter podcasts
      </label>
      <input
        id="filter-podcasts"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter podcasts..."
        className="w-full rounded border border-gray-300 px-3 py-2 sm:w-64"
      />
    </div>
  )
}

export default PodcastFilter
