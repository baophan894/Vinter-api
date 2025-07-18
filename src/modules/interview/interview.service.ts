import { Injectable, NotFoundException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import axios from 'axios';
import * as PDFDocument from 'pdfkit';
import { Interview } from './entities/interview.schema';

const questionCountByMode = {
  basic: 5,
  advanced: 10,
  challenge: 15,
};

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(Interview.name) private readonly interviewModel: Model<Interview>,
  ) {}

  async createInterview(buffer: Buffer, jd: string, mode: 'basic' | 'advanced' | 'challenge') {
    const pdfText = (await pdfParse(buffer)).text;
    const count = questionCountByMode[mode];

    const prompt = `JD:\n"""${jd}"""\nCV:\n"""${pdfText}"""\n\nTạo ${count} câu hỏi phỏng vấn dạng gạch đầu dòng, tập trung vào ${mode}.`;

    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const content = res.data.choices[0].message.content as string;
    const questions = content
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((q) => q.replace(/^[-•]\s*/, ''));

    const interview = await this.interviewModel.create({
      jd,
      cvText: pdfText,
      questions,
      answers: {},
      mode,
    });

    return {
      sessionId: interview.sessionId,
      questions,
    };
  }

  async saveAnswer(sessionId: string, question: string, answer: string) {
    const interview = await this.interviewModel.findOne({ sessionId });
    if (!interview) throw new NotFoundException('Session not found');
    interview.answers[question] = answer;
    await interview.save();
    return { success: true };
  }

  async generatePdfReport(sessionId: string): Promise<Buffer> {
    const interview = await this.interviewModel.findOne({ sessionId });
    if (!interview) throw new NotFoundException('Session not found');

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    doc.fontSize(16).text(`Interview Report: ${sessionId}`, { underline: true });
    doc.moveDown();

    interview.questions.forEach((q, index) => {
      const a = interview.answers[q] || '(chưa trả lời)';
      doc.fontSize(12).text(`${index + 1}. ${q}`);
      doc.fontSize(11).text(`    Trả lời: ${a}`);
      doc.moveDown();
    });

    doc.end();
    return await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}