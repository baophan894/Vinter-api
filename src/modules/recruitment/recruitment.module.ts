import { Module } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recruitment, RecruitmentSchemaFactory } from './entities/recruitment.entity';

@Module({
  imports: [
      MongooseModule.forFeatureAsync([{
        name: Recruitment.name,
        useFactory: RecruitmentSchemaFactory,
          inject: [],
          imports: [MongooseModule.forFeature([])],
        }
      ])
    ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
})
export class RecruitmentModule {}
