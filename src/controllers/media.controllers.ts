import { Request, Response } from 'express'
import { MESSAGES } from '~/constants/messages'
import mediaService from '~/services/media.services'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediaService.handleUploadImage(req)
  return res.json({
    message: MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
