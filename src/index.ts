// eslint-disable-next-line @typescript-eslint/no-var-requires
const actualBudget = require('@actual-app/api')

import { NeonExport } from './zod/Neon'
import { Transaction } from './zod/Transaction'
import { env } from './env'
import { sendTransactions } from './actualBudget'
import fs from 'fs'
import csv from 'csvtojson'

const csvFilePath = process.argv[2]
if (!csvFilePath) {
  throw new Error(
    'No CSV file path provided. Run the script like this: `npx ts-node ./src/index.ts example.csv` to make sure the script knows about the location of the CSV data to import'
  )
}

const main = async () => {
  const fileData = fs
    .readFileSync(csvFilePath)
    .toString()
    .replace(/Account Statements (\d+_\d+|\d+)/g, '') // Remove file prefix of "Account Statements 2024" or "Account Statements 2024_5", etc.

  const rows = await csv({ delimiter: ';', quote: `"` }).fromString(
    fileData.toString()
  )

  const data = NeonExport.parse(rows)
  console.log('parsed data', data)

  const transactions: Transaction[] = data.map(
    ({ Date, Amount, Category, Description }) => {
      return {
        account: env.ACTUAL_BUDGET_ACCOUNT_ID,
        date: Date,
        amount: actualBudget.utils.amountToInteger(Amount),
        payee_name: Description,
        notes: Description,
        category: Category,
        cleared: true,
      }
    }
  )
  await sendTransactions(transactions)
}

main()
