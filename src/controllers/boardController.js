/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'


const createNew = async( req, res, next) => {
  try {
    // dieu huong du lieu sang tang service
    const createdBoard = await boardService.createNew(req.body)

    // co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json(createdBoard)
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Manhnq dev test error')

  } catch (error) { next(error) }
}



export const boardController = {
  createNew
}