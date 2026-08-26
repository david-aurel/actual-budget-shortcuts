import { getNeonCsv } from './neon'
import { sendTransactions } from './utils/actualBudget'
import { parseCsvToTransactions } from './utils/parseCsv'
import { env } from './utils/env'

export type Account = 'personal' | 'joined'

interface AccountConfig {
  iban: string
  accountId: string
  syncId: string
}

function getAccountConfig(account: Account): AccountConfig {
  if (account === 'personal') {
    return {
      iban: env.NEON_IBAN_PERSONAL,
      accountId: env.ACTUAL_BUDGET_ACCOUNT_ID_PERSONAL,
      syncId: env.ACTUAL_BUDGET_SYNC_ID_PERSONAL,
    }
  }
  return {
    iban: env.NEON_IBAN_JOINED,
    accountId: env.ACTUAL_BUDGET_ACCOUNT_ID_JOINED,
    syncId: env.ACTUAL_BUDGET_SYNC_ID_JOINED,
  }
}

async function syncAccount(account: Account): Promise<void> {
  const { iban, accountId, syncId } = getAccountConfig(account)

  console.log(`[neon-sync] Fetching CSV for ${account} account (IBAN: ${iban})`)
  const csvData = await getNeonCsv(iban)

  const transactions = await parseCsvToTransactions(csvData, accountId)

  console.log(
    `[neon-sync] Importing ${transactions.length} transactions for ${account} account`
  )
  await sendTransactions(syncId)({ accountId, transactions })
  console.log(`[neon-sync] Done syncing ${account} account`)
}

/**
 * Syncs one or both Neon accounts into Actual Budget.
 * Defaults to syncing both accounts when no argument is provided.
 */
export async function neonSync(account?: Account): Promise<void> {
  const accounts: Account[] = account ? [account] : ['personal', 'joined']

  for (const acc of accounts) {
    await syncAccount(acc)
  }
}
