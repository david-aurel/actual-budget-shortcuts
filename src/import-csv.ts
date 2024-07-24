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
const csvHeader = /Account Statements (\d+_\d+|\d+)/g

export const importCsv: RouterMiddleware<'/:syncId/import-csv'> = async (
  context
) => {
  const body = await context.request.body.json()
  const { base64Csv, accountId } = bodyCodec.parse(body)
  const { syncId } = context.params

  const rawCsvData = atob(base64Csv)
  const csvData = rawCsvData.replace(csvHeader, '') // Remove prefix of "Account Statements 2024_5" etc.
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
  await sendTransactions(syncId)(transactions)

  context.response.body = { message: 'Success' }
}
