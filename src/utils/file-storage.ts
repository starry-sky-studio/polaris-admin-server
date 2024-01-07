import * as multer from 'multer'
import * as fs from 'fs'

export const storage = (uploads: string = 'uploads') =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        fs.mkdirSync(uploads)
      } catch (e) {
        console.log('生成文件目录失败')
      }
      cb(null, uploads)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() + '_' + Math.round(Math.random() * 1e6) + '_' + file.originalname
      cb(null, uniqueSuffix)
    }
  })
