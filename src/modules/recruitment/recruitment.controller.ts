import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('recruitment')
@ApiBearerAuth('token')
export class RecruitmentController {
 constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin', 'HR')
  @ApiOperation({ summary: 'Đăng bài tuyển dụng' })
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'Frontend Developer',
            description: 'Tiêu đề của tin tuyển dụng',
          },
          description: {
            type: 'string',
            example: 'We are looking for a skilled frontend developer...',
            description: 'Mô tả chi tiết công việc',
          },
          company: {
            type: 'string',
            example: 'FPT Software',
            description: 'Tên công ty tuyển dụng',
          },
          employmentType: {
            type: 'string',
            example: 'Full-time',
            description: 'Hình thức làm việc (Full-time, Part-time, Internship, ...)',
          },
          location: {
            type: 'string',
            example: 'Remote',
            description: 'Địa điểm làm việc',
          },
          experience: {
            type: 'string',
            example: 'Minimum 1 year experience',
            description: 'Yêu cầu kinh nghiệm',
          },
          salaryRange: {
            type: 'string',
            example: '500 - 700 USD/month',
            description: 'Khoảng lương',
          },
          keyResponsibilities: {
            type: 'string',
            example: '- Build UI components\n- Collaborate with backend team',
            description: 'Các trách nhiệm chính trong công việc',
          },
          requirements: {
            type: 'string',
            example: '- Proficient in React\n- Familiar with Tailwind CSS',
            description: 'Yêu cầu kỹ năng/kinh nghiệm',
            nullable: true,
          },
          benefits: {
            type: 'string',
            example: '- Competitive salary\n- Flexible working hours',
            description: 'Quyền lợi được hưởng',
            nullable: true,
          },
          companyValues: {
            type: 'string',
            example: 'Innovation, Integrity, Customer-first',
            description: 'Giá trị cốt lõi của công ty',
            nullable: true,
          },
          deadline: {
            type: 'string',
            format: 'date-time',
            example: '2025-08-01T23:59:59.000Z',
            description: 'Thời hạn ứng tuyển',
            nullable: true,
          },
        },
        required: [
          'title',
          'description',
          'company',
          'employmentType',
          'location',
          'experience',
          'salaryRange',
          'keyResponsibilities'
        ],
      },
    })
  async create(@Body() dto: CreateRecruitmentDto,) {
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
        description: 'Tiêu đề của tin tuyển dụng',
      },
      description: {
        type: 'string',
        example: 'We are looking for a skilled frontend developer...',
        description: 'Mô tả chi tiết công việc',
      },
      company: {
        type: 'string',
        example: 'FPT Software',
        description: 'Tên công ty tuyển dụng',
      },
      employmentType: {
        type: 'string',
        example: 'Full-time',
        description: 'Hình thức làm việc (Full-time, Part-time, Internship, ...)',
      },
      location: {
        type: 'string',
        example: 'Remote',
        description: 'Địa điểm làm việc',
      },
      experience: {
        type: 'string',
        example: 'Minimum 1 year experience',
        description: 'Yêu cầu kinh nghiệm',
      },
      salaryRange: {
        type: 'string',
        example: '500 - 700 USD/month',
        description: 'Khoảng lương',
      },
      keyResponsibilities: {
        type: 'string',
        example: '- Build UI components\n- Collaborate with backend team',
        description: 'Các trách nhiệm chính trong công việc',
      },
      requirements: {
        type: 'string',
        example: '- Proficient in React\n- Familiar with Tailwind CSS',
        description: 'Yêu cầu kỹ năng/kinh nghiệm',
        nullable: true,
      },
      benefits: {
        type: 'string',
        example: '- Competitive salary\n- Flexible working hours',
        description: 'Quyền lợi được hưởng',
        nullable: true,
      },
      companyValues: {
        type: 'string',
        example: 'Innovation, Integrity, Customer-first',
        description: 'Giá trị cốt lõi của công ty',
        nullable: true,
      },
      deadline: {
        type: 'string',
        format: 'date-time',
        example: '2025-08-01T23:59:59.000Z',
        description: 'Thời hạn ứng tuyển',
        nullable: true,
      },
    },
    required: [
      'title',
      'description',
      'company',
      'employmentType',
      'location',
      'experience',
      'salaryRange',
      'keyResponsibilities'
    ],
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
