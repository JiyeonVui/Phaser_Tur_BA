import Joi from 'joi' // joi doc
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

const CreateNew = async ( req, res, next ) => {
  /**
   * Note : Mặc định chúng ta (back-end) ko cần phải custom message o phía BE làm gì vì để cho Front-end tự validate va custom
   * massage phía PE cho đẹp
   * Back-end chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
   * Quan trong: Việc validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ liệu vào database
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luốn validate dữ liệu ở cả Back-end và Front-end nhé.
   */

  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    console.log('correctCondition', correctCondition)
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next() // => dung cho controller

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async ( req, res, next ) => {
  /**
   * Ko dung required trong th update
  */
  console.log('Update column')
  const correctCondition = Joi.object({
    // Neu can lam tinh nang di chuyen column sang board khac thi moi them validate board id
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).messages(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
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
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}


export const columnValidation = {
  CreateNew,
  update
}