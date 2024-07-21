import { VercelRequest, VercelResponse } from '@vercel/node'
import { utils } from '@actual-app/api'

import csv from 'csvtojson'
import { NeonExportCodec } from '../../../src/zod/Neon'
import { Transaction } from '../../../src/zod/Transaction'
import { sendTransactions } from '../../../src/actualBudget'
import { env } from '../../../src/env'
export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method not allowed')
  }

  const authHeader = request.headers['authorization']
  if (!authHeader || authHeader !== env.ACTUAL_BUDGET_SERVER_PASSWORD) {
    return response.status(401).send('Unauthorized')
  }

  const syncId = request.query['syncId'] as string
  const accountId = request.query['accountId'] as string
  const base64Csv = request.body.base64Csv as string

  // Remove file prefix of "Account Statements 2024" or "Account Statements 2024_5", etc.
  const csvData = atob(base64Csv).replace(
    /Account Statements (\d+_\d+|\d+)/g,
    ''
  )
  const rows = await csv({ delimiter: ';', quote: `"` }).fromString(
    csvData.toString()
  )

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

  response.end()
}
