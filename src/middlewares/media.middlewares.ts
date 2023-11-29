import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'

export const updatePhotoValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    throw new ErrorWithStatus({
      message: MESSAGES.INVALID_ID,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const { name, description } = req.body

  if (!name) {
    throw new ErrorWithStatus({
      message: MESSAGES.NAME_IS_REQUIRED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  if (typeof name !== 'string') {
    throw new ErrorWithStatus({
      message: MESSAGES.NAME_MUST_BE_A_STRING,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  if (description == undefined) {
    console.log('herhe')
    throw new ErrorWithStatus({
      message: MESSAGES.DESCRIPTION_IS_REQUIRED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  if (typeof description !== 'string') {
    throw new ErrorWithStatus({
      message: MESSAGES.DESCRIPTION_MUST_BE_A_STRING,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  next()
}
