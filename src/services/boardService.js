/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from "~/utils/formatters"
import { boardModel } from "~/models/boardModel"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"
import { cloneDeep } from "lodash"
import { columnModel } from "~/models/columnModel"
import { cardModel } from "~/models/cardModel"

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

const getDetails = async ( boardId ) => {
  try {

    // goi toi tang model de xu ly ban ghi new board trong database
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    // B1 Deep clone board
    const resBoard = cloneDeep(board)
    // B2 Dua card ve dung column cua no
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card =>
        // card.columnId.toString() === column._id.toString()
        // console.log('card.columnId', card.columnId)
        card.columnId.equals(column._id)
      )
    })
    // B3 Xoa mang card khoi board ban dau
    delete resBoard.cards

    return resBoard

  } catch (error) { throw error }
}

const update = async ( boardId, reqBody ) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    // goi toi tang model de xu ly ban ghi new board trong database
    const updateBoard = await boardModel.update(boardId, updateData)

    return updateBoard

  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async ( reqBody ) => {
  try {
    // update mang CardOrderIds cua column ban dau chua card
    console.log('prev card order ids', reqBody.prevCardOrderIds)
    console.log('next card order ids', reqBody.nextCardOrderIds)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds : reqBody.prevCardOrderIds,
      updateAt : Date.now()
    })
    // update mang CardOrderIds cua column moi
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds : reqBody.nextCardOrderIds,
      updateAt : Date.now()
    })

    // Cap nhat lai ColumnId cua card da keo
    console.log('reqBody.nextcolumId', reqBody.nextColumnId)
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updateAt: Date.now()
    })
    return { updateResult : 'Successfully!' }

  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}