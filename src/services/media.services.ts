import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request } from 'express'
import { handleUploadImage } from '~/utils/files'
import fsPromise from 'fs/promises'
import sharp from 'sharp'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_S3_PATH, UPLOAD_THUMBNAIL_DIR, UPLOAD_THUMBNAIL_S3_PATH } from '~/constants/dir'
import { uploadFileToS3 } from '~/utils/s3'
import databaseService from './database.services'
import Photo from '~/models/schemas/Photo.schema'
import { ObjectId } from 'mongodb'

class MediaService {
  async handleUploadImage(req: Request) {
    const data = await handleUploadImage(req)
    const { name, description } = data
    const files = data.image
    const imageURLs = await Promise.all(
      files.map(async (file) => {
        // const newName = getFileName(file.newFilename)
        const newName = new ObjectId().toString()
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        const thumbnailPath = path.resolve(UPLOAD_THUMBNAIL_DIR, `${newName}.jpg`)

        // resize image
        await sharp(file.filepath).jpeg().toFile(newPath)
        await sharp(file.filepath).resize(300, 300, { fit: 'inside' }).jpeg().toFile(thumbnailPath)

        // upload images to s3
        const s3Result = await Promise.all([
          uploadFileToS3({
            filename: `${UPLOAD_IMAGE_S3_PATH}/${newFullFileName}`,
            filepath: newPath,
            contentType: 'image/jpeg'
          }),
          uploadFileToS3({
            filename: `${UPLOAD_THUMBNAIL_S3_PATH}/${newFullFileName}`,
            filepath: thumbnailPath,
            contentType: 'image/jpeg'
          })
        ])

        // delete temp files
        Promise.all([
          fsPromise.unlink(file.filepath),
          fsPromise.unlink(newPath),
          fsPromise.unlink(thumbnailPath)
        ]).catch((err) => console.error('Unlink error', err))

        return {
          id: newName,
          image: (s3Result[0] as CompleteMultipartUploadCommandOutput).Location as string,
          thumbnail: (s3Result[1] as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )

    const insertData = imageURLs.map((item, index) => {
      return new Photo({
        _id: new ObjectId(item.id),
        name: name ? name[index] || item.id : item.id,
        description: description ? description[index] || '' : '',
        thumbnail: item.thumbnail,
        image: item.image
      })
    })

    await databaseService.photos.insertMany(insertData)

    return insertData
  }

  async handleGetPhotos(limit: number, offset: number) {
    const cursor = databaseService.photos.find({}).skip(offset).limit(limit)
    const result = await cursor.toArray()
    return result
  }

  async handleEditPhoto(_id: string, name: string, description: string) {
    const result = await databaseService.photos.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name: name,
          description: description
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return result
  }
}

const mediaService = new MediaService()

export default mediaService
