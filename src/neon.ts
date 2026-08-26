import { env } from './utils/env'

const NEON_BASE_URL = 'https://prd-env.neon-free.ch'
const APP_VERSION = '9.0.1'
const USER_AGENT = 'neon/34224 CFNetwork/3896.100.1.2.1 Darwin/27.0.0'

interface NeonToken {
  accessToken: string
  expiresIn: number
  tokenType: string
}

/**
 * Authenticates against the Neon API using OAuth2 implicit flow.
 * The API responds with a 302 redirect; the token is in the Location fragment.
 * The token is never logged and kept in memory only for the duration of the sync.
 */
async function authenticate(): Promise<NeonToken> {
  const params = new URLSearchParams({
    realm: 'Test 1',
    scope: 'all:read_write',
    username: env.NEON_USERNAME,
    response_type: 'token',
    password: env.NEON_PASSWORD,
    client_id: env.NEON_CLIENT_ID,
    state: 'test',
  })

  const response = await fetch(
    `${NEON_BASE_URL}/neon/authentication/oauth2/authenticate?appVersion=${APP_VERSION}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
        'Accept-Language': 'en-CH,en;q=0.5',
        'User-Agent': USER_AGENT,
      },
      body: params.toString(),
      redirect: 'manual',
    }
  )

  // Expect a 302 redirect; anything else is an error
  if (response.status !== 302) {
    throw new Error(
      `Neon auth: unexpected status ${response.status} (expected 302)`
    )
  }

  const location = response.headers.get('location')
  if (!location) {
    throw new Error('Neon auth: missing Location header in redirect response')
  }

  const parsed = new URL(location)
  const fragment = new URLSearchParams(parsed.hash.slice(1))

  const accessToken = fragment.get('access_token')
  const expiresIn = Number(fragment.get('expires_in'))
  const tokenType = fragment.get('token_type')

  if (!accessToken) {
    throw new Error('Neon auth: access_token not found in redirect fragment')
  }

  return {
    accessToken,
    expiresIn,
    tokenType: tokenType ?? 'Bearer',
  }
}

/**
 * Fetches the Neon CSV statement for a given IBAN and month.
 * Always fetches the current month unless overridden.
 */
async function fetchCsv(
  accessToken: string,
  iban: string,
  year?: number,
  month?: number
): Promise<string> {
  const now = new Date()
  const targetYear = year ?? now.getFullYear()
  const targetMonth = month ?? now.getMonth() + 1 // getMonth() is 0-indexed

  const params = new URLSearchParams({
    year: String(targetYear),
    month: String(targetMonth),
    iban,
  })

  const response = await fetch(
    `${NEON_BASE_URL}/neon/transaction-service/api/account-statement/csv?${params}`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Origin: 'ionic://localhost',
        'Accept-Language': 'de',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': USER_AGENT,
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      `Neon CSV fetch failed for IBAN ${iban}: HTTP ${response.status}`
    )
  }

  return response.text()
}

/**
 * Authenticates and fetches the CSV for a given IBAN in one call.
 * The token is obtained fresh each time and discarded after use.
 */
export async function getNeonCsv(iban: string): Promise<string> {
  const { accessToken } = await authenticate()
  return fetchCsv(accessToken, iban)
}
