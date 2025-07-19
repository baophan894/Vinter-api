import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';

@Controller('recruitment')
export class RecruitmentController {
 constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post()
  async create(@Body() dto: CreateRecruitmentDto, @Req() req: any) {
    return this.recruitmentService.create(dto, req.user.userId);
  }

  @Get()
  async getAll() {
    return this.recruitmentService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.recruitmentService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRecruitmentDto) {
    return this.recruitmentService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.recruitmentService.delete(id);
  }
}
