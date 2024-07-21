import { VercelRequest, VercelResponse } from '@vercel/node'

import fs from 'fs'
import path from 'path'

const migrationsPath = path.resolve(
  __dirname,
  'node_modules/@actual-app/api/dist'
)

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  // Check if the path exists
  console.log(request.url)
  fs.readdir(migrationsPath, (err, files) => {
    if (err) {
      throw new Error('Error reading migrations directory:', err)
    } else {
      throw new Error(`Migrations directory contents: ${files}`)
    }
  })
  // if (request.method !== 'GET') {
  //   return response.status(405).send('Method not allowed')
  // }
  // const authHeader = request.headers['authorization']
  // if (!authHeader || authHeader !== env.ACTUAL_BUDGET_SERVER_PASSWORD) {
  //   return response.status(401).send('Unauthorized')
  // }

  // const syncId = request.query['syncId'] as string

  // const accounts = await getAccounts(syncId)()

  return response.setHeader('Content-Type', 'application/json').send({})
}
