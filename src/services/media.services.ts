import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request } from 'express'
import { getFileName, handleUploadImage } from '~/utils/files'
import fsPromise from 'fs/promises'
import sharp from 'sharp'
import path from 'path'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { uploadFileToS3 } from '~/utils/s3'

class MediaService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: string[] = await Promise.all(
      files.map(async (file) => {
        const newName = getFileName(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: newFullFileName,
          filepath: newPath,
          contentType: 'image/jpeg'
        })

        Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)]).catch((err) =>
          console.error('Unlink error', err)
        )

        return (s3Result as CompleteMultipartUploadCommandOutput).Location as string
      })
    )

    return result
  }
}

const mediaService = new MediaService()

export default mediaService
