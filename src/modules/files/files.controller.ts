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
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/excel',
      storage: storage('uploads/excel')
    })
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //   fileType: /.xlsx?$/i
        // })
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
    return '上传成功'
  }

  @ApiOperation({ summary: '上传多个文件' })
  @Post('uploads')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 }
      ],
      {
        dest: 'uploads',
        storage: storage('uploads')
      }
    )
  )
  uploadFiles(
    @UploadedFiles() files: { avatar?: Express.Multer.File[]; background?: Express.Multer.File[] }
  ) {
    console.log(files)
    return '上传成功'
  }

  @ApiOperation({ summary: '上传数组' })
  @Post('array')
  @UseInterceptors(
    FilesInterceptor('files', 3, { dest: 'uploads/array', storage: storage('uploads/array') })
  )
  uploadFileArray(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files)
    return '上传成功'
  }

  @ApiOperation({ summary: '上传头像' })
  @ApiParam({
    type: 'id',
    name: 'id',
    description: '上传头像Id'
  })
  @Post('avatar/:id(\\d+)')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/avatar',
      storage: storage('uploads/avatar'),
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
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param('id') id: number) {
    console.log(typeof id)
    return await this.filesService.saveAvatar(file.originalname, Number(id))
  }

  @ApiOperation({ summary: '大图分片上传' })
  @Post('large')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads'
    })
  )
  uploadLargeFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body)
    console.log('files', files)
  }
}
