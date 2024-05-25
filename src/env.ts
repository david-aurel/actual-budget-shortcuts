import 'dotenv/config'
import { cleanEnv, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
  ACTUAL_BUDGET_SERVER_URL: url(),
  ACTUAL_BUDGET_SERVER_PASSWORD: str(),
  ACTUAL_BUDGET_SYNC_ID: str(),
  ACTUAL_BUDGET_ACCOUNT_ID: str(),
})
