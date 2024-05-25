// eslint-disable-next-line @typescript-eslint/no-var-requires
const actualBudget = require('@actual-app/api')
import fs from 'fs'
const dataDir = `./downloads`

import { env } from './env'
import { Transaction } from './zod/Transaction'

const withActualBudget = async (callback: () => Promise<void>) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
  }
  await actualBudget.init({
    dataDir: './downloads',
    serverURL: env.ACTUAL_BUDGET_SERVER_URL,
    password: env.ACTUAL_BUDGET_SERVER_PASSWORD,
  })

  await actualBudget.downloadBudget(env.ACTUAL_BUDGET_SYNC_ID)

  await callback()

  await actualBudget.shutdown()
}

export const sendTransactions = (transactions: Transaction[]) =>
  withActualBudget(async () => {
    await actualBudget.importTransactions(
      env.ACTUAL_BUDGET_ACCOUNT_ID,
      transactions
    )
  })

export const getAccounts = () => withActualBudget(actualBudget.getAccounts)
