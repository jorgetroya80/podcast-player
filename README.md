# Podcast Player

A single-page application to browse the top 100 music podcasts and listen to their episodes. Data comes from the public iTunes APIs.

- **List** (`/`): the 100 most popular music podcasts, with an instant filter by title and author.
- **Podcast detail** (`/podcast/:podcastId`): cover, description, episode count and a table of episodes.
- **Episode detail** (`/podcast/:podcastId/episode/:episodeId`): title, description and an audio player.

## Table of contents

1. [Quick start](#quick-start)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Patterns](#patterns)
6. [Design decisions](#design-decisions)
7. [Error handling and edge cases](#error-handling-and-edge-cases)
8. [Security](#security)
9. [Testing](#testing)
10. [Accessibility and responsive design](#accessibility-and-responsive-design)
11. [Known limitations](#known-limitations)

## Quick start

**Requirements**

- Node.js 24 or newer (the minimum required by React Router 8).
- [pnpm](https://pnpm.io/installation). It can be installed through [Corepack](https://nodejs.org/api/corepack.html), which ships with Node.js: `corepack enable`.

**Install**

```bash
pnpm install
```

**Development mode** (unminified assets, hot module replacement)

```bash
pnpm dev
```

**Production mode** (concatenated and minified assets in `dist/`)

```bash
pnpm build
pnpm preview
```

**Other scripts**

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `pnpm test`          | Tests in watch mode                           |
| `pnpm test:coverage` | Tests once, with a V8 coverage report         |
| `pnpm lint`          | ESLint (includes the architecture boundaries) |
| `pnpm typecheck`     | TypeScript project build without emitting     |
| `pnpm format`        | Format everything with Prettier               |

### Why pnpm instead of npm

The project is developed and tested with pnpm, and `pnpm-lock.yaml` is the only lockfile. The reasons:

1. **Strict `node_modules`.** Only dependencies declared in `package.json` can be imported. npm's flat layout lets code import packages that are only there by accident (phantom dependencies). That matters here because the architecture is built on explicit, checked imports.
2. **Supply-chain controls.** Lifecycle scripts of dependencies only run when they are listed in `allowBuilds` in `pnpm-workspace.yaml` (today only `msw`). pnpm can also hold back very recently published versions (`minimumReleaseAge`); the few deliberate exceptions are listed in `minimumReleaseAgeExclude`.
3. **Reproducible installs.** Dependencies are pinned to exact versions (no `^` or `~`), and the lockfile is committed.
4. **Speed and disk usage.** Packages live in a content-addressable store shared across projects and are linked into `node_modules`, so installs are fast and cheap.

npm is not supported: there is no `package-lock.json`, and mixing lockfiles would produce different dependency trees.

## Features

- Instant, case-insensitive filter of the list by title and author.
- Progress indicator at the top right while navigating or loading data.
- Client-side routing with clean URLs (no `#`) and layouts that stay mounted: the podcast sidebar is not remounted when moving between a podcast and its episodes.
- Data is cached in the browser for 24 hours (see [Design decisions](#design-decisions)).
- Episode descriptions are rendered as formatted HTML after sanitization.
- Loading skeletons, empty states and user-facing error messages.
- Responsive layout with a maximum width of 1280 px.

## Tech stack

| Area                | Choice                                                                                      | Why                                                   |
| ------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| UI                  | [React](https://react.dev) 19 + TypeScript 6                                                | Typed components and hooks                            |
| Build tool          | [Vite](https://vite.dev) 8                                                                  | Fast dev server; minified production bundle           |
| Routing             | [React Router](https://reactrouter.com) 8 (data router)                                     | Loaders, nested layouts, `errorElement`               |
| Server state        | [TanStack Query](https://tanstack.com/query) 5 + async storage persister                    | Caching, deduplication, persistence in `localStorage` |
| Styling             | CSS Modules (built into Vite) with native CSS                                               | Scoped styles, mobile-first, no preprocessor          |
| HTML sanitization   | [DOMPurify](https://github.com/cure53/DOMPurify) 3                                          | Safe rendering of episode descriptions                |
| URL detection       | [linkify-it](https://github.com/markdown-it/linkify-it) 6.1.0                               | Turns plain-text URLs in descriptions into links      |
| Tests               | [Vitest](https://vitest.dev), Testing Library, `user-event`, [MSW](https://mswjs.io), jsdom | Behavior-level tests with a mocked network            |
| Lint and formatting | ESLint 10 (+ `eslint-plugin-boundaries`), Prettier                                          | Consistent code and enforced layer rules              |
| Package manager     | pnpm                                                                                        | See [Why pnpm](#why-pnpm-instead-of-npm)              |

There is no global client state library (no Redux, no Zustand): server data lives in TanStack Query, and the only local UI state is the filter text.

## Architecture

The code follows a **simplified Feature-Sliced Design (FSD)**. FSD organizes an application in layers with a strict dependency direction and in feature slices that expose a public API. This project keeps the parts that give the most value for its size and drops the rest:

- **Kept:** layers with dependencies that only point downwards, feature slices, a public API per slice (`index.ts`), and the rule that a slice never imports from another slice.
- **Simplified:** only four layers (`app`, `pages`, `features`, `shared`; no `widgets` or `entities`), and plain segment folders inside a feature (`api`, `components`, `hooks`, `utils`).

### Layers

```
src/
  app/        Application shell: providers, router, route loaders, layouts, global styles
  pages/      One component per route; thin, they only compose features
  features/   Business slices, each with its own public API (index.ts)
    podcasts/        list, filter, card, skeletons
    podcast-detail/  sidebar, episode table, detail query, episode loader
    episode-detail/  audio player, sanitized description
  shared/     Code with no business knowledge: HTTP client, query client,
              errors, route-param helpers, formatting helpers, generic
              components, shared types
  test/       Test support: MSW server and fixtures, render helpers
```

Allowed dependencies (enforced by `eslint-plugin-boundaries`, see `eslint.config.js`):

```
app  ▶  pages  ▶  features  ▶  shared
```

Each layer may also import from any layer below it (for example `app` can import `shared` directly).

| From       | May import from                      |
| ---------- | ------------------------------------ |
| `app`      | `pages`, `features`, `shared`        |
| `pages`    | `features`, `shared`                 |
| `features` | `shared` only (never other features) |
| `shared`   | nothing above it                     |

Importing a feature only through its `index.ts` is the convention for the public API. It is followed throughout the code but is not yet enforced by a lint rule.

### Inside a feature

```
features/podcast-detail/
  api/         Queries, mappers, loaders and API types (podcastDetailQuery, mapPodcastDetail, episodeLoader, …)
  components/  Presentational components (PodcastSidebar, EpisodeTable, …)
  hooks/       usePodcastDetail
  index.ts     Public API: the only file other layers import from
```

### Routes and layouts

```
AppLayout                      header + progress indicator + <Outlet />
├─ /                           PodcastListPage
├─ /podcast/:podcastId         PodcastLayout (fixed sidebar + <Outlet />)
│    ├─ index                  PodcastDetailPage
│    └─ episode/:episodeId     EpisodeDetailPage
└─ *                           any other URL: a loader throws a 404 response
```

Errors are caught by a single `errorElement` that wraps the content below the header, so the header always stays visible. URLs that match no route fall into the `*` catch-all, whose loader throws a 404 response; the same error screen renders it as "Page not found.". The episode route has its own `errorElement`, so an unknown episode shows its message in the right-hand column while the sidebar stays.

Route loaders live next to what they validate. The episode loader sits in the `podcast-detail` feature (`api/episodeLoader.ts`): it validates the episode and returns it, and the page reads it with `useLoaderData`, so there is one lookup per navigation. The app-level loaders (`podcastLayoutLoader`, `notFoundLoader`) are in `src/app/loaders.ts`. `router.tsx` only declares routes.

### Data flow

```
page ─▶ feature hook ─▶ TanStack Query ─▶ getJson ─▶ buildRequestUrl ─▶ fetch ─▶ iTunes
                              │
                              └─▶ cache (24 h, persisted in localStorage)
```

- Views never call `fetch`. They read data through hooks built on `queryOptions`.
- The same `queryOptions` are used by route loaders (`queryClient.query`) and by components (`useQuery`), so the cache is shared and requests are deduplicated.
- API responses are mapped to small domain types (`Podcast`, `PodcastDetail`, `Episode`) at the edge, in `mapPodcasts` and `mapPodcastDetail`. UI code never sees iTunes' field names.

## Patterns

- **Feature slices with a public API.** Each feature hides its internals behind `index.ts`. Example: `src/features/podcasts/index.ts`.
- **Query options as the single source of truth.** `podcastsQuery` and `podcastDetailQuery(id)` define key, fetching and mapping once; loaders and components reuse them.
- **Container and presentational components.** `PodcastList` (container) wires hooks and picks the state to show; `PodcastCard`, `PodcastGrid`, `EpisodeTable` and the skeleton and empty-state components only receive props.
- **SOLID in practice.**
  - _Single responsibility:_ fetching, mapping, filtering and rendering live in separate modules (`podcastsQuery`, `mapPodcasts`, `filterPodcasts`, `PodcastCard`).
  - _Open/closed:_ a new state or filter is a new component or function, not an edit of existing ones.
  - _Interface segregation:_ components take only what they use, for example `PodcastCard` receives `id`, `name`, `artist` and `image`, not a whole `Podcast`.
  - _Dependency inversion:_ containers depend on hooks (`usePodcasts`, `usePodcastDetail`), not on `fetch`. Tests replace the network with MSW.
- **Composition in the `app` layer.** `PodcastLayout` is the only place that combines two features (the cached podcast list and the podcast detail), and the sidebar's data-source rule lives in its `useSidebarPodcast` hook. Features stay independent.
- **Small typed errors.** `HttpError` (carries the status) and `NotFoundError` (carries a user-facing message) live in `shared`. Features throw them directly (`new NotFoundError('Podcast not found')`), so the shared error screen can render them without knowing the features and there is one class per kind of failure, not one per feature.
- **Required route params.** Components read params with `useRequiredParam('podcastId')` and the episode loader with `requireParam`; a missing param throws `Missing route param: <name>` instead of falling back to `''`.
- **Null object instead of `null`.** `mapPodcastDetail` never returns `null`: an unknown podcast (200 with empty `results`) maps to `EMPTY_PODCAST_DETAIL`, and the absence of the podcast is modeled in the type (`PodcastDetail.info?`). Callers (`findEpisode`, pages, `useSidebarPodcast`) need no null checks.
- **Pure functions for logic.** `filterPodcasts`, `formatDate`, `formatDuration`, `plainTextToHtml` and `findEpisode` have no side effects and are tested in isolation.

## Design decisions

| Decision                                                        | Alternatives considered                             | Reason                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Call iTunes directly with `fetch`**, no CORS proxy            | A public proxy such as `allorigins.win`             | iTunes answers with `access-control-allow-origin: *`, so a proxy is not needed. A proxy adds latency and a third party, and it wraps every response in a `200`, which would hide the real HTTP status that `getJson` relies on to tell a `400` from a `5xx`. If CORS is ever closed, `buildRequestUrl` is the single place to change.                                                                            |
| **24 h cache, persisted in `localStorage`**                     | In-memory cache only                                | The list and each detail are requested again only after 24 hours, even across reloads. `staleTime`, `gcTime` and `maxAge` are all 24 h; `main.tsx` waits for the cache to be restored before creating the router, otherwise loaders would hit the network even with stored data. `CACHE_BUSTER` (`queryClient.ts`) is passed as `buster` to `persistQueryClient`; bump it when the shape of cached data changes. |
| **React Router data router with loaders**                       | Fetching only inside components                     | Loaders make navigation state observable, which powers the progress indicator and the first-load skeletons (`HydrateFallback`). On `/` the fallback is the page itself (same frame and filter, with the skeleton grid inside), so the first item does not move when the data arrives.                                                                                                                            |
| **The podcast layout loader waits only for the list**           | Waiting for list and detail; no loader at all       | The sidebar can paint instantly from the cached list while the episodes load behind a skeleton on the right. Without a loader the indicator would not show when the data is already cached, and the sidebar could flicker between two data sources.                                                                                                                                                              |
| **Sidebar data from the cached list item**                      | Always from the detail response                     | The list item is already in cache, so the sidebar needs no network. If the podcast is not in the top 100 (for example a direct link), name, artist and image come from the detail response and the description is omitted.                                                                                                                                                                                       |
| **One `errorElement` instead of an error boundary per feature** | Per-feature error boundaries                        | Loader and query failures all end in the same place, and the user sees a consistent message. Fewer moving parts.                                                                                                                                                                                                                                                                                                 |
| **`retry: false`**                                              | TanStack Query's default of 3 retries with back-off | Errors reach the user immediately instead of after several seconds of silent retries.                                                                                                                                                                                                                                                                                                                            |
| **No logging inside `useEffect`**                               | Logging errors in the error component               | Failed queries are logged once by the query cache (`QueryCache.onError`), and the episode loader logs a missing episode once. Effects are not used for side effects that are not about synchronizing with the outside world.                                                                                                                                                                                     |
| **DOMPurify for descriptions**                                  | `sanitize-html`, `xss`                              | DOMPurify sanitizes against the browser's own parser, is small and widely audited, whereas `xss` filters strings rather than the DOM.                                                                                                                                                                                                                                                                            |
| **Descriptions are plain text more often than HTML**            | Rendering the raw string                            | iTunes usually sends plain text with newlines. `plainTextToHtml` turns blank-line separated blocks into paragraphs (and single newlines into `<br>`) before sanitizing, and returns real HTML untouched.                                                                                                                                                                                                         |
| **Detect URLs with `linkify-it`**                               | `linkify-html`, a hook inside DOMPurify             | Detecting before sanitizing keeps DOMPurify as the last guard. Schema-less domains (`podcastchoices.com/adchoices`) are handled by a maintained library instead of a hand-written regex, at the cost of one small dependency.                                                                                                                                                                                    |
| **Own components, no UI library**                               | Component libraries                                 | The UI is small; plain CSS Modules are enough and keep the bundle light.                                                                                                                                                                                                                                                                                                                                         |
| **CSS Modules with native CSS**                                 | Tailwind CSS, Sass, CSS-in-JS                       | No preprocessor or styling dependency: Vite compiles CSS Modules out of the box and modern CSS (nesting, custom properties, range media queries) covers what the utilities did. Each component owns a `.module.css` file with locally scoped class names; design tokens, reset and keyframes are global in `src/app/styles/`.                                                                                    |
| **Exact dependency versions**                                   | Version ranges                                      | Reproducible builds; updates are deliberate.                                                                                                                                                                                                                                                                                                                                                                     |

## Error handling and edge cases

| Situation                                                 | What the user sees                                                                           |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| iTunes returns `5xx`, network failure or invalid JSON     | "Something went wrong. Please try again later." below the header                             |
| Invalid podcast id (iTunes answers `400`)                 | "Podcast not found."                                                                         |
| Valid but unknown podcast id (`200` with empty `results`) | The page loads with 0 episodes and "No episodes available" (not an error, nothing is logged) |
| Podcast with no episodes                                  | Episode count from the API and "No episodes available"                                       |
| Unknown episode id                                        | "Episode not found." in the right-hand column; sidebar and header stay                       |
| Podcast not in the top 100                                | Sidebar built from the detail response, without description                                  |
| Podcast list request fails on the detail route            | Detail page still works; the sidebar uses the detail data                                    |
| Unknown URL (matches no route)                            | "Page not found." below the header                                                           |
| Episode without audio URL                                 | "Audio not available for this episode." instead of the player                                |
| Episode without description                               | The description block is not rendered                                                        |
| Episode without duration                                  | Empty cell in the table; "Duration" is omitted on the episode page                           |

Failed queries are written to `console.error` once, by the query cache (`QueryCache.onError`), with message and stack. `getJson` only throws.

## Security

Episode descriptions come from third parties and are injected into the page, so they are sanitized first (`src/features/episode-detail/components/sanitizeHtml.ts`):

- Pipeline: `plainTextToHtml` (escape + link detection with linkify-it) → DOMPurify → `dangerouslySetInnerHTML`.
- Link detection runs on plain text only, before sanitizing, and creates only `http(s)` links (never `mailto:` or other schemes); real HTML is not linkified.
- DOMPurify's default profile removes `<script>`, `<iframe>`, `on*` handlers and `javascript:` URLs.
- A hook forces `target="_blank"` and `rel="noopener noreferrer"` on every link, so authors cannot opt out.
- The DOMPurify instance is created with `createDOMPurify(window)` and is isolated, so the hook does not leak into any global instance.
- Plain text is HTML-escaped before it becomes markup.
- Dependencies are pinned and installed with restricted build scripts (see [Why pnpm](#why-pnpm-instead-of-npm)).

## Testing

- **Stack:** Vitest, React Testing Library, `user-event` and MSW, in jsdom. Tests sit next to the code they cover; shared support lives in `src/test/`.
- **Network:** MSW intercepts `fetch` and serves fixtures taken from real iTunes responses. Unhandled requests fail the test.
- **Helpers:** `renderWithProviders` (fresh `QueryClient` with `retry: false` plus a memory router) and `renderRoutes` (renders the real route tree at a given URL).
- **What is tested:**
  - pure helpers and mappers
  - components in isolation
  - full pages through the real router: loading, filtering, navigation, empty and error states
  - the 24 h cache (with a fake clock and request counting)
  - sanitization (scripts, event handlers, `javascript:` URLs and iframes are removed)
- **What is not tested:** styling, library internals and end-to-end flows in a real browser.
- **Coverage:** the threshold is **85 %** for statements, branches, functions and lines across the whole project (`coverage.thresholds` in `vite.config.ts`). `pnpm test:coverage` fails if any of them drops below 85 %.
- **Architecture rules** are checked by ESLint (`pnpm lint`), not by tests.

## Accessibility and responsive design

- Loading states use `role="status"`; errors use `role="alert"`.
- The episode list is a real `<table>` with a caption and header scope.
- Cover images have `alt` text, controls are reachable with the keyboard, and the audio player has an accessible name.
- The layout is mobile-first: the sidebar stacks above the content on small screens and sits at the side from the `md` breakpoint. Content is centered with a maximum width of 1280 px.

## Known limitations

- Only the **20 most recent episodes** are shown per podcast, which is what the iTunes lookup returns with the limit used. The episode count shown is the real total reported by the API.
- iTunes omits the duration (`trackTimeMillis`) of some episodes, mostly older ones (for example, 13 of the 20 episodes of one podcast we checked). Those rows show an empty duration cell.
- On a direct load of `/podcast/:id` the first-load skeleton is a plain placeholder, not framed like the final layout (sidebar plus content column), so it shifts when the layout appears. The list route does not have this problem.
- Links without a scheme (`example.com/path`) are only detected for the TLDs built into `linkify-it` (two-letter country codes plus `com`, `net`, `org`, `info`, and a few more); domains such as `.app` or `.dev` stay plain text unless written with `https://`.
- The same detection can link a sentence end written without a space after the period when the next word is a country-code TLD (for example `culture.In` or `Who.Is` in real descriptions), because it cannot tell a domain from a typo.
- The audio player is the browser's native `<audio controls>`, so its look varies between browsers.
- There is no server-side rendering and no service worker; the cache lives in the browser's `localStorage`.
