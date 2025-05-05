import Joi from 'joi' // joi doc
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants' // import BOARD_TYPES tu constants.js
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const CreateNew = async ( req, res, next ) => {
  /**
   * Note : Mặc định chúng ta (back-end) ko cần phải custom message o phía BE làm gì vì để cho Front-end tự validate va custom
   * massage phía PE cho đẹp
   * Back-end chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
   * Quan trong: Việc validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ liệu vào database
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luốn validate dữ liệu ở cả Back-end và Front-end nhé.
   */
  console.log('req.body', req.body)
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      // messages => dung de custom message video 52 trungquandev
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must be at most 50 characters long',
      'string.trim': 'Title must not contain leading or trailing spaces'
    }),
    boardId: Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next() // => dung cho controller

  } catch (error) {
    console.log('error', error)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async ( req, res, next ) => {
  /**
   * Ko dung required trong th update
  */
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })

    next() // => dung cho controller

  } catch (error) {
    console.log('error', error)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}



export const boardValidation = {
  CreateNew,
  update
}