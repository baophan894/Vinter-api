import { Injectable } from '@nestjs/common';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Recruitment } from './entities/recruitment.entity';
import { Model } from 'mongoose';

@Injectable()
export class RecruitmentService {
  constructor(@InjectModel(Recruitment.name) private recruitmentModel: Model<Recruitment>) {}

  async create(createDto: CreateRecruitmentDto, userId: string): Promise<Recruitment> {
    return this.recruitmentModel.create({ ...createDto, createdBy: userId });
  }

  async findAll(): Promise<Recruitment[]> {
    return this.recruitmentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Recruitment | null> {
    return this.recruitmentModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateRecruitmentDto): Promise<Recruitment | null> {
    return this.recruitmentModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.recruitmentModel.findByIdAndDelete(id).exec();
  }
}
