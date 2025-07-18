import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruitmentDto } from './create-recruitment.dto';

export class UpdateRecruitmentDto extends PartialType(CreateRecruitmentDto) {}
