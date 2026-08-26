import { z } from 'zod'
import { parseCsvToTransactions } from './utils/parseCsv'
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
    const transactions = await parseCsvToTransactions(csvData, accountId)

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
