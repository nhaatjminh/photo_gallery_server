import { config } from 'dotenv'
config()

import express from 'express'
import databaseService from './services/database.services'
import cors from 'cors'
import { initFolder } from './utils/files'
import mediaRouter from './routes/media.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'

databaseService.connect()

const app = express()
const port = process.env.PORT || 5001

initFolder()

app.use(express.json())
app.use(cors())

app.use('/media', mediaRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
