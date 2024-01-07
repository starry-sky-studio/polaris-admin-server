import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFiles,
  HttpStatus,
  BadRequestException,
  Param
} from '@nestjs/common'
import { FilesService } from './files.service'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { storage } from '@/utils'
import * as path from 'path'
@ApiTags('文件上传')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: '上传单个excel文件' })
  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png'
        })
        .addMaxSizeValidator({
          maxSize: 100000
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    file: Express.Multer.File
  ) {
    console.log(file)
  }

  @ApiOperation({ summary: '上传多个文件' })
  @Post('uploads')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 }
    ])
  )
  uploadFiles(
    @UploadedFiles() files: { avatar?: Express.Multer.File[]; background?: Express.Multer.File[] }
  ) {
    console.log(files)
  }

  @Post('array')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFileArray(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files)
  }

  @ApiOperation({ summary: '上传头像' })
  @ApiParam({
    type: 'id',
    name: 'id',
    description: '上传头像Id'
  })
  @Post('avatar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: storage,
      fileFilter(req, file, callback) {
        const extname = path.extname(file.originalname)
        if (['.png', '.jpg', '.gif'].includes(extname)) {
          callback(null, true)
        } else {
          callback(new BadRequestException('只能上传图片'), false)
        }
      }
    })
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param() id: number) {
    return await this.filesService.saveAvatar(file.originalname, id)
  }
}
