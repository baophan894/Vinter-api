import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cv, CvSchemaFactory } from './entities/cv.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [
        MongooseModule.forFeatureAsync([{
          name: Cv.name,
          useFactory: CvSchemaFactory,
            inject: [],
            imports: [MongooseModule.forFeature([])],
          }
        ])
      ],
  controllers: [CvController],
  providers: [
    CvService,
    CloudinaryService,
  ],
})
export class CvModule {}
