import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Cv, CvDocument } from './entities/cv.entity';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class CvService {
  constructor(
    @InjectModel(Cv.name) private readonly cvModel: Model<CvDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadCv(file: Express.Multer.File, userId: string): Promise<Cv> {
    const filename = file.originalname.replace(/\.[^/.]+$/, ''); // remove extension
    const url = (await this.cloudinaryService.uploadPdfBuffer(file.buffer, filename, 'cv')).url;
    const context = (await this.cloudinaryService.uploadPdfBuffer(file.buffer, filename, 'cv')).content;

    const createdCv = new this.cvModel({
      filename: file.originalname,
      url: url,
      content: context,
      createdBy: userId,
    });

    return createdCv.save();
  }

  async findAll(): Promise<Cv[]> {
    return this.cvModel.find().sort({ created_at: -1 }).exec();
  }

  async deleteById(id: string): Promise<Cv | null> {
    return this.cvModel.findByIdAndDelete(id);
  }

  async findByUserId(id: string): Promise<Cv | null> {
    return this.cvModel.findOne({ createdBy: id }).exec();
  }

}
