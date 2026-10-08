import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App'
import { createAppRouter } from './app/router'
import './app/styles/index.css'
import { ONE_DAY_MS, persister, queryClient } from './shared/api/queryClient'

const [, restored] = persistQueryClient({ queryClient, persister, maxAge: ONE_DAY_MS })
await restored

const router = createAppRouter(queryClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App router={router} queryClient={queryClient} />
  </StrictMode>,
)
