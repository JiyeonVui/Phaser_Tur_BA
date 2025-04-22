import Joi from 'joi' // joi doc
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const CreateNew = async ( req, res, next ) => {
  /**
   * Note : Mặc định chúng ta (back-end) ko cần phải custom message o phía BE làm gì vì để cho Front-end tự validate va custom
   * massage phía PE cho đẹp
   * Back-end chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
   * Quan trong: Việc validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ liệu vào database
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luốn validate dữ liệu ở cả Back-end và Front-end nhé.
   */

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      // messages => dung de custom message video 52 trungquandev 
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // console.log(req.body)
    // abortEarly : false de truong hop co nhieu loi thi tra ve tat ca loio
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next() // => dung cho controller

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  CreateNew
}