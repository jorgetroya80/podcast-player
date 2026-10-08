import type { TopPodcastsResponse } from "./types"

function mapPodcasts(response: TopPodcastsResponse) {
    return response.feed.entry.map((entry) => ({
        id: entry.id.attributes['im:id'],
        name: entry['im:name'].label,
        artist: entry['im:artist'].label,
        image: entry['im:image'][2].label,
        summary: entry.summary.label,
    }))
}

export { mapPodcasts }