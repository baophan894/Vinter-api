import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateCvDto } from './dto/create-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('upload')
@ApiOperation({ summary: 'Upload CV' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary' },
      userId: { type: 'string' }, // thêm trường userId
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
async uploadCv(
  @UploadedFile() file: Express.Multer.File,
  @Body('userId') userId: string,
): Promise<any> {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  return this.cvService.uploadCv(file, userId);
}

  @Get('userId/:id')
  @ApiOperation({ summary: 'Get cv by userid' })
  async findByUserId(@Param('id')  userId: string): Promise<any> {
    const cv = await this.cvService.findByUserId(userId);
    if (!cv) {
      throw new BadRequestException('CV not found for this user');
    }
    return cv;
  }
}
