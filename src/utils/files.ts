import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_THUMBNAIL_DIR } from '~/constants/dir'
import { parseFieldsFormData } from './common'

export interface PhotosData {
  name: string[]
  description: string[]
  image: File[]
}

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_THUMBNAIL_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // create nested folder
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 3000 * 1024, // 300 KB
    maxTotalFileSize: 3000 * 1024 * 4,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<PhotosData>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      // eslint-disable-next-line no-extra-boolean-cast
      const image = files.image as File[]
      const result = {
        ...parseFieldsFormData(fields as any),
        image: image
      }
      resolve(result as PhotosData)
    })
  })
}

export const getFileName = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}
