import { Router } from 'express'
import { getImagesController, uploadImagesController } from '~/controllers/media.controllers'
import { requestHandlerWrapper } from '~/utils/handlers'

const mediaRouter = Router()

/**
 * Description. upload images
 * Path: /media/upload-image
 * Method: POST
 * Body: { image: File[], name: string[], description: string[] }
 */
mediaRouter.post('/upload-image', requestHandlerWrapper(uploadImagesController))

/**
 * Description. Get photos
 * Path: /media/photos
 * Method: GET
 */
mediaRouter.get('/photos', requestHandlerWrapper(getImagesController))

export default mediaRouter
