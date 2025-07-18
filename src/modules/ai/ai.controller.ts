import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { InterviewService } from '../interview/interview.service';
import { Response } from 'express';

@Controller('ai')
@ApiTags('AI')
export class AiController {
    constructor(private readonly aiService: AiService,
        private readonly interviewService: InterviewService,
    ) { }

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

    @Post('interview-session')
    @ApiOperation({ summary: 'Tạo câu hỏi phỏng vấn theo chế độ (basic/advanced/challenge)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                jd: { type: 'string' },
                mode: {
                    type: 'string',
                    enum: ['basic', 'advanced', 'challenge'],
                },
                cv: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('cv'))
    async generateInterviewByMode(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { jd: string; mode: 'basic' | 'advanced' | 'challenge' },
    ) {
        return this.aiService.generateInterviewQuestionsFromJDAndCVByMode(file.buffer, body.jd, body.mode);
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

    @Post('start-interview')
    @UseInterceptors(FileInterceptor('cv'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                jd: { type: 'string' },
                mode: { type: 'string', enum: ['basic', 'advanced', 'challenge'] },
                cv: { type: 'string', format: 'binary' },
            },
        },
    })
    async startInterview(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { jd: string; mode: 'basic' | 'advanced' | 'challenge' },
    ) {
        return this.interviewService.createInterview(file.buffer, body.jd, body.mode);
    }

    @Post('answer')
    async saveAnswer(@Body() body: { sessionId: string; question: string; answer: string }) {
        return this.interviewService.saveAnswer(body.sessionId, body.question, body.answer);
    }
    @Get('export/:sessionId')
    async exportPdf(@Param('sessionId') sessionId: string, @Res({ passthrough: true }) res: Response) {
        const buffer = await this.interviewService.generatePdfReport(sessionId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="interview-${sessionId}.pdf"`);
        res.send(buffer);
    }

}
