/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {

  const app = express()

  // enable req.body joson data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    exitHook(()=>{
      console.log('4. Disconnecting')
      CLOSE_DB()
      console.log('5. Disconnected')
    })

    console.log(`Hello ${env.AUTHOR}, I am running at http://${ env.APP_HOST }:${ env.APP_PORT }/`)
  })
}

// IIFE javascript

(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB cloud Atlas')

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit()
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
