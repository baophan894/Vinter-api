import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechService } from './speech.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('speech')
@ApiTags('Speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('fpt-transcribe')
  @ApiOperation({ summary: 'Upload audio file to convert to text (FPT.AI ASR)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async transcribeWithFPT(@UploadedFile() file: Express.Multer.File) {
    return this.speechService.transcribeWithFPT(file);
  }

  @Post('fpt-speak')
  @ApiOperation({ summary: 'Convert text to speech using FPT.AI TTS' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          example: 'Xin chào, tôi là trợ lý ảo của bạn!',
        },
      },
    },
  })
  async speakWithFPT(@Body() body: { text: string }) {
    return this.speechService.speakWithFPT(body.text);
  }
}
