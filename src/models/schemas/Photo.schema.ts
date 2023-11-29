import { ObjectId } from 'mongodb'

interface PhotoType {
  _id?: ObjectId
  name?: string
  description?: string
  thumbnail: string
  image: string
  created_at?: Date
  updated_at?: Date
}

export default class Photo {
  _id?: ObjectId
  name: string
  description: string
  thumbnail: string
  image: string
  created_at: Date
  updated_at: Date

  constructor({ _id, name, description, thumbnail, image, created_at, updated_at }: PhotoType) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.name = name || ''
    this.description = description || ''
    this.thumbnail = thumbnail || ''
    this.image = image || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
