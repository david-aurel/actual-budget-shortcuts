import 'dotenv/config'
import { cleanEnv, bool, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
  ACTUAL_BUDGET_SERVER_URL: url(),
  ACTUAL_BUDGET_SERVER_PASSWORD: str(),

  // Actual Budget sync
  ACTUAL_BUDGET_SYNC_ID_PERSONAL: str(),
  ACTUAL_BUDGET_SYNC_ID_JOINED: str(),
  ACTUAL_BUDGET_ACCOUNT_ID_PERSONAL: str(),
  ACTUAL_BUDGET_ACCOUNT_ID_JOINED: str(),

  // Neon API credentials
  NEON_USERNAME: str(),
  NEON_PASSWORD: str(),
  NEON_CLIENT_ID: str(),

  // Neon account IBANs
  NEON_IBAN_PERSONAL: str(),
  NEON_IBAN_JOINED: str(),

  // Scheduler (set to false to disable the daily 12:00 auto-import)
  NEON_SCHEDULER_ENABLED: bool({ default: true }),
})
