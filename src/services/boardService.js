/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from "~/utils/formatters"
import { boardModel } from "~/models/boardModel"

const createNew = async ( reqBody ) => {
  try {
    // xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // goi toi tang model de xu ly ban ghi new board trong database
    const createBoard = await boardModel.createNew(newBoard)

    // lay ban ghi board sau khi goi (tuy vao muc dich su dung)
    const getNewBoard = boardModel.findOneById(createBoard.insertedId)
    // tra ket qua ve trong service => luon phai co return
    return getNewBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}