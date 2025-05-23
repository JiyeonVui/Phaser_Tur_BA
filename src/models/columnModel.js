/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const INVALID_UPDATE_FILEDS = ['_id', 'boardId', 'createAt']

const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId) // Chuyển đổi boardId thành ObjectId
    }
    const createColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    return createColumn

  } catch (error) { throw new Error(error) } // thuong la loi he thong nen ko can phai bat ky apierror
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}

const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { returnDocument: 'after' }
    )
    // console.log('result', result.value)
    // console.log('column', column.boardId)

    return result.value

  } catch (error) { throw new Error(error) }
}


const update = async (columnId, updateData) => {
  try {
    // Loc field ma chung ta ko cho phep cap nhat linh tinh
    Object.keys(updateData).forEach( filedName => {
      if (INVALID_UPDATE_FILEDS.includes(filedName)) {
        delete updateData[filedName]
      }
    })

    if ( updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map( _id => (new ObjectId(_id)))
    }

    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    // console.log('result', result.value)
    // console.log('column', column.boardId)

    return result

  } catch (error) { throw new Error(error) }
}


const deleteOneById = async (columId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(columId)
    })
    console.log('🚀 ~ result ~ result:', result)
    return result
  } catch (error) { throw new Error(error) }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById
}