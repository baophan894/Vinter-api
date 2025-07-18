import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { InterviewService } from '../interview/interview.service';
import { InterviewSchema } from '../interview/entities/interview.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'Interview', schema: InterviewSchema },
    ]),
  ],
  controllers: [AiController],
  providers: [AiService, InterviewService],
})
export class AiModule {}
