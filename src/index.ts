import { getAccounts } from './get-accounts'
import { importCsv } from './import-csv'
import { auth } from './auth'
import { Application, Router } from '@oakserver/oak'
import { z } from 'zod'
import cron from 'node-cron'
import { neonSync, Account } from './neon-sync'
import { env } from './utils/env'

const app = new Application()

const router = new Router()

router
  .get('/:syncId/get-accounts', getAccounts)
  .post('/:syncId/import-csv', importCsv)
  .post('/neon-sync', async (context) => {
    try {
      const body = await context.request.body.json().catch(() => ({}))
      const parsed = z
        .object({ account: z.enum(['personal', 'joined']).optional() })
        .safeParse(body)

      const account: Account | undefined = parsed.success
        ? parsed.data.account
        : undefined

      // Run async so the response is returned immediately
      neonSync(account).catch((err) =>
        console.error('[neon-sync] Background sync error:', err)
      )

      context.response.body = {
        message: `Neon sync started for: ${account ?? 'both accounts'}`,
      }
    } catch (error) {
      console.error('[neon-sync] Endpoint error:', error)
      context.response.status = 500
      context.response.body = {
        message: error instanceof Error ? error.message : 'Unknown Error',
      }
    }
  })

app.use(auth)
app.use(router.routes())
app.use(router.allowedMethods())

// Daily scheduled sync at 12:00 (noon), local server time
if (env.NEON_SCHEDULER_ENABLED) {
  cron.schedule('0 12 * * *', () => {
    console.log('[neon-sync] Scheduled sync triggered')
    neonSync().catch((err) =>
      console.error('[neon-sync] Scheduled sync error:', err)
    )
  })
  console.log('[neon-sync] Scheduler enabled — daily sync at 12:00')
} else {
  console.log('[neon-sync] Scheduler disabled (NEON_SCHEDULER_ENABLED=false)')
}

app.listen({ port: 8000, hostname: '0.0.0.0' })
