import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ai')
@ApiTags('AI')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('generate-checklist')
    @ApiOperation({ summary: 'Gửi JD để nhận checklist chuẩn bị phỏng vấn' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                jd: {
                    type: 'string',
                    example: 'We are hiring a frontend developer with experience in React, TypeScript, and Tailwind CSS...',
                },
            },
        },
    })
    async generateChecklist(@Body() body: { jd: string }) {
        return this.aiService.generateChecklist(body.jd);
    }

    @Post('generate-questions')
    @ApiOperation({ summary: 'Gửi JD để AI sinh câu hỏi phỏng vấn phù hợp' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                jd: {
                    type: 'string',
                    example: 'We are hiring a Node.js backend developer...',
                },
            },
        },
    })
    async generateInterviewQuestions(@Body() body: { jd: string }) {
        return this.aiService.generateInterviewQuestions(body.jd);
    }


    @Post('generate-study-plan')
    @ApiOperation({ summary: 'Từ checklist đầu việc, gợi ý kiến thức cần học để chuẩn bị phỏng vấn' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                checklist: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'Tìm hiểu kỹ mô tả công việc và yêu cầu kỹ thuật',
                        'Chuẩn bị trả lời các câu hỏi về MongoDB và Node.js',
                    ],
                },
            },
        },
    })
    async generateStudyPlan(@Body() body: { checklist: string[] }) {
        return this.aiService.generateStudyPlan(body.checklist);
    }

    @Post('analyze-cv')
    @ApiOperation({ summary: 'Phân tích mức độ phù hợp của CV với JD' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                jd: {
                    type: 'string',
                    example:
                        'We are hiring a backend developer with Node.js, MongoDB, RESTful API...',
                },
                cv: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['jd', 'cv'],
        },
    })
    @UseInterceptors(FileInterceptor('cv'))
    async analyzeCv(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { jd: string },
    ) {
        return this.aiService.analyzeCvWithJD(file.buffer, body.jd);
    }

}
