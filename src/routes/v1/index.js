/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'

const Router = express.Router()
/* Check api v1 status */
Router.get('/status', ( req, res ) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

Router.use('/boards', boardRoute)

// Column api
Router.use('/columns', columnRoute)

// Card api
Router.use('/cards', cardRoute)

export const APIs_V1 = Router