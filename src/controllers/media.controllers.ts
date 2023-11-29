import { Request, Response } from 'express'
import { MESSAGES } from '~/constants/messages'
import mediaService from '~/services/media.services'

export const uploadImagesController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadImage(req)
  return res.json({
    message: MESSAGES.UPLOAD_SUCCESS,
    result
  })
}

export const getImagesController = async (req: Request, res: Response) => {
  const { limit, offset } = req.query
  const _limit = limit ? parseInt(limit as string) : 0
  const _offset = offset ? parseInt(offset as string) : 0
  const result = await mediaService.handleGetPhotos(_limit, _offset)
  return res.json({
    message: MESSAGES.GET_PHOTOS_SUCCESS,
    result
  })
}
