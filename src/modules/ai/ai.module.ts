import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { InterviewService } from '../interview/interview.service';
import { InterviewSchema } from '../interview/entities/interview.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitmentService } from '../recruitment/recruitment.service';
import { RecruitmentSchema } from '../recruitment/entities/recruitment.entity';
import { Cv, CvSchema } from '../cv/entities/cv.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'Interview', schema: InterviewSchema },
      { name: 'Recruitment', schema: RecruitmentSchema },
      { name: Cv.name, schema: CvSchema }
    ]),
  ],
  controllers: [AiController],
  providers: [AiService, InterviewService, RecruitmentService],
})
export class AiModule {}
