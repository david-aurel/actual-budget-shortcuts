import { getAccounts } from './get-accounts'
import { importCsv } from './import-csv'
import { auth } from './auth'
import { Application, Router } from '@oakserver/oak'

const app = new Application()

const router = new Router()
router
  .get('/:syncId/get-accounts', getAccounts)
  .post('/:syncId/import-csv', importCsv)

app.use(auth)
app.use(router.routes())
app.use(router.allowedMethods())

app.listen({ port: 8000, hostname: '0.0.0.0' })
