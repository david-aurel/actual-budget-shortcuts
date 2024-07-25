import 'dotenv/config'
import { cleanEnv, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
  ACTUAL_BUDGET_SERVER_URL: url(),
  ACTUAL_BUDGET_SERVER_PASSWORD: str(),
})
