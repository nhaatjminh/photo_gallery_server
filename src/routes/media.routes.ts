import { Router } from 'express'
import { getPhotosController, uploadPhotosController, updatePhotoController } from '~/controllers/media.controllers'
import { updatePhotoValidator } from '~/middlewares/media.middlewares'
import { requestHandlerWrapper } from '~/utils/handlers'

const mediaRouter = Router()

/**
 * Description. upload images
 * Path: /media/upload-image
 * Method: POST
 * Body: { image: File[], name: string[], description: string[] }
 */
mediaRouter.post('/photos', requestHandlerWrapper(uploadPhotosController))

/**
 * Description. Get photos
 * Path: /media/photos
 * Method: GET
 */
mediaRouter.get('/photos', requestHandlerWrapper(getPhotosController))

/**
 * Description. Edit photos
 * Path: /media/photos/:id
 * Method: PUT
 */
mediaRouter.put('/photos/:id', updatePhotoValidator, requestHandlerWrapper(updatePhotoController))

export default mediaRouter
