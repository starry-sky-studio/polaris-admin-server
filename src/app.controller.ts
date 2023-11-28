import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Headers,
  HttpStatus,
  Param
} from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { CccDto } from './dto/ccc.dto'
import { CccVo } from './dto/ccc.vo'
// import { FileSizeValidationPipe } from './file-size-validation-pipe.pipe'

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  private jwtService: JwtService

  private logger = new Logger()

  @ApiBearerAuth('bearer')
  @ApiTags('Auth-ttt')
  @ApiOperation({ summary: '测试token', description: 'token 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String
  })
  @Get('ttt')
  ttt(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1]
        const data = this.jwtService.verify(token)

        const newToken = this.jwtService.sign({
          count: data.count + 1
        })
        response.setHeader('token', newToken)
        return data.count + 1
      } catch (e) {
        console.log(e)
        throw new UnauthorizedException()
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 1
      })

      console.log('222222222')

      response.setHeader('token', newToken)
      return 1
    }
  }

  @ApiCookieAuth('cookie')
  @ApiTags('Auth-aaa')
  @ApiOperation({ summary: '测试', description: '描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功',
    type: String
  })
  @ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111'
  })
  @ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222
  })
  @Get()
  async getHello() {
    this.logger.log('hello', AppController.name)
    return await this.appService.getHello()
  }

  @ApiBasicAuth('basic')
  @ApiTags('Auth-aaa')
  @ApiOperation({ summary: '测试id', description: '描述id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'id 不合法'
  })
  @ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222
  })
  @Get('get/:id')
  bbb(@Param('id') id: number) {
    console.log(id)
    if (id !== 111) {
      throw new UnauthorizedException()
    }
    return 'bbb success'
  }

  @ApiOperation({ summary: '测试ccc' })
  @Post('ccc')
  ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc)

    const vo = new CccVo()
    vo.aaa = 111
    vo.bbb = 222
    return vo
  }

  @Post()
  test(): string {
    this.logger.log('test', AppController.name)
    return this.appService.test()
  }

  @Post('aaa')
  @UseInterceptors(
    FileInterceptor('aaa', {
      dest: 'uploads'
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body, '1111111')
    console.log('file', file, '222222')
  }

  @Post('uploadFiles')
  @UseInterceptors(
    FilesInterceptor('uploadFiles', 3, {
      dest: 'uploads'
    })
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body
  ) {
    console.log('body', body)
    console.log('files', files)
  }
}
