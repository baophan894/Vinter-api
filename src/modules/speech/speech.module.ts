import { Module } from '@nestjs/common';
import { SpeechController } from './speech.controller';
import { SpeechService } from './speech.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [SpeechController],
  providers: [SpeechService, CloudinaryService],
})
export class SpeechModule {}
