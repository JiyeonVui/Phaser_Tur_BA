/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { get } from "lodash"
import { columnModel } from "~/models/columnModel"
import { boardModel } from "~/models/boardModel" 
import { cardModel } from "~/models/cardModel"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

const createNew = async ( reqBody ) => {
  try {
    // xu ly logic du lieu tuy dac thu du an
    const newColumn = {
      ...reqBody
    }

    const createColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

    // ...

    if (getNewColumn) {
      getNewColumn.cardOrderIds = [] // Chua co card nao nen khoi tao mang rong
      getNewColumn.cards = [] // Chua co card nao nen khoi tao mang rong

      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

const update = async ( columnId, reqBody ) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    // goi toi tang model de xu ly ban ghi new board trong database
    const updateColumn = await columnModel.update(columnId, updateData)

    return updateColumn

  } catch (error) { throw error }
}

const deleteItem = async ( columnId ) => {
  const targetColumn = await columnModel.findOneById(columnId)

  if (!targetColumn) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
  }

  // xoa columnId trong columnOderids cua board
  await boardModel.pullColumnOrderIds(targetColumn)
  // xoa column
  await columnModel.deleteOneById(columnId)
  // xoa card thuoc column tren
  await cardModel.deleteManyByColumnId(columnId)
  return { deleteResult: 'Column and its card deleted successfully!' }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}