import { z } from 'zod'
import csv from 'csvtojson'
import { NeonExportCodec } from './utils/zod/Neon'
import { Transaction } from './utils/zod/Transaction'
import { utils } from '@actual-app/api'
import { sendTransactions } from './utils/actualBudget'
import { RouterMiddleware } from '@oakserver/oak'

const bodyCodec = z.object({
  base64Csv: z.string(),
  accountId: z.string(),
})

export const importCsv: RouterMiddleware<'/:syncId/import-csv'> = async (
  context
) => {
  try {
    const body = await context.request.body.json()
    const { accountId, base64Csv } = bodyCodec.parse(body)

    const { syncId } = context.params

    const csvData = Buffer.from(base64Csv, 'base64').toString()
    const rows = await csv({ delimiter: ';', quote: `"` }).fromString(csvData)
    const data = NeonExportCodec.parse(rows)

    const transactions: Transaction[] = data.map(
      ({ Date, Amount, Category, Description }) => {
        return {
          account: accountId,
          date: Date,
          amount: utils.amountToInteger(Amount),
          payee_name: Description,
          notes: Description,
          category: Category,
          cleared: true,
        }
      }
    )
    await sendTransactions(syncId)({ accountId, transactions })

    context.response.body = { message: 'Success' }
  } catch (error) {
    console.error(error)
    context.response.status = 500
    context.response.body = {
      message: error instanceof Error ? error.message : 'Unknown Error',
    }
  }
}
