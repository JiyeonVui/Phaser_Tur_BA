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

export const columnService = {
  createNew
}