import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('recruitment')
export class RecruitmentController {
 constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post()
  @ApiOperation({ summary: 'Đăng bài tuyển dụng' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Frontend Developer',
        },
        description: {
          type: 'string',
          example: 'We are looking for a skilled frontend developer...',
        },
        requirements: {
          type: 'string',
          example: '- Proficient in React\n- Familiar with Tailwind CSS',
        },
        benefits: {
          type: 'string',
          example: '- Competitive salary\n- Remote-friendly',
        },
        deadline: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-01T23:59:59.000Z',
        },
      },
      required: ['title', 'description'], // các trường bắt buộc
    },
  })
  async create(@Body() dto: CreateRecruitmentDto) {
    return this.recruitmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'View all bài tuyển dụng' })
  async getAll() {
    return this.recruitmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bài tuyển dụng bằng id' })
  async getById(@Param('id') id: string) {
    return this.recruitmentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bài tuyển dụng' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Frontend Developer',
        },
        description: {
          type: 'string',
          example: 'We are looking for a skilled frontend developer...',
        },
        requirements: {
          type: 'string',
          example: '- Proficient in React\n- Familiar with Tailwind CSS',
        },
        benefits: {
          type: 'string',
          example: '- Competitive salary\n- Remote-friendly',
        },
        deadline: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-01T23:59:59.000Z',
        },
      },
      required: ['title', 'description'],
    },
  })
  async update(@Param('id') id: string, @Body() dto: UpdateRecruitmentDto) {
    return this.recruitmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá bài tuyển dụng' })
  async delete(@Param('id') id: string) {
    return this.recruitmentService.delete(id);
  }
}
