import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as pdfParse from 'pdf-parse';
import { RecruitmentService } from '../recruitment/recruitment.service';
import { User, UserSchema } from '../user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cv } from '../cv/entities/cv.entity';
@Injectable()
export class AiService {
  
    constructor(
  private readonly recruitmentService: RecruitmentService,
      @InjectModel(Cv.name) private cVModel: Model<Cv>,
) {}

    generateInterviewQuestions(jd: string) {
        
        throw new Error('Method not implemented.');
    }
    async generateChecklist(jd: string): Promise<{ checklist: string[] }> {
        const prompt = `
Tôi là người đang chuẩn bị đi phỏng vấn cho vị trí sau đây:

"""${jd}"""

Hãy liệt kê danh sách các việc cần làm để chuẩn bị phỏng vấn, trình bày dưới dạng danh sách gạch đầu dòng.
`;

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

        const checklist = content
            .split('\n')
            .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
            .map((line) => line.replace(/^[-•]\s*/, '').trim());

        return { checklist };
    }

    static questionCountByMode = {
        basic: 5,
        advanced: 10,
        challenge: 15,
    };

    async generateInterviewQuestionsFromJDAndCVByMode(
        fileBuffer: Buffer,
        jd: string,
        mode: keyof typeof AiService.questionCountByMode,
    ): Promise<{ questions: string[]; type: string }> {
        const pdfData = await pdfParse(fileBuffer);
        const cvText = pdfData.text.trim();
        if (!cvText) {
            throw new Error('CV không hợp lệ hoặc không đọc được nội dung.');
        }

        const count = AiService.questionCountByMode[mode];

        const prompt = `
Bạn là một chuyên gia tuyển dụng kỹ thuật.

JD:
"""
${jd}
"""

CV của ứng viên:
"""
${cvText}
"""

Hãy tạo khoảng ${count} câu hỏi phỏng vấn ${mode === 'basic' ? 'cơ bản (kinh nghiệm, kiến thức nền)' : mode === 'advanced' ? 'chuyên sâu (thuật toán, tình huống)' : 'thử thách (case thực tế, tư duy)'}, dựa vào JD và CV.

Trình bày danh sách gạch đầu dòng. Nếu có thể, hãy ưu tiên hỏi về các dự án cụ thể có trong CV.
`;

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
            .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
            .map((line) => line.replace(/^[-•]\s*/, '').trim());

        return {
            questions,
            type: mode,
        };
    }

    async generateStudyPlan(checklist: string[]): Promise<{ sections: { title: string, items: string[] }[] }> {
        const joinedChecklist = checklist.map((item, i) => `${i + 1}. ${item}`).join('\n');

        const prompt = `
Tôi đang chuẩn bị cho buổi phỏng vấn, và dưới đây là danh sách các việc tôi cần làm:

${joinedChecklist}

Với mỗi đầu việc trên, hãy liệt kê những kiến thức hoặc kỹ năng cụ thể tôi cần học hoặc ôn tập. Mỗi kiến thức trình bày theo định dạng:

1. [Tên đầu việc]
- [Tên kiến thức]: [Giải thích ngắn gọn gồm định nghĩa, nội dung chính và cách ứng dụng trong thực tế phỏng vấn hoặc công việc]

Yêu cầu:
- Không liệt kê đơn thuần tên kiến thức, mà cần mô tả súc tích, có chiều sâu.
- Ưu tiên kiến thức kỹ thuật, kỹ năng mềm, và kiến thức nền có thể học được hoặc ôn trong thời gian ngắn.
- Cấu trúc rõ ràng để dễ đưa vào tài liệu PDF cho người học.
`;

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

        // Tách nội dung theo block từng mục học (dạng "1. Tiêu đề")
        const blocks = content.split(/\n(?=\d+\.\s)/g);

        const sections = blocks.map((block) => {
            const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
            const titleLine = lines[0];
            const title = titleLine.replace(/^\d+\.\s*/, '');
            const items = lines.slice(1)
                .filter((line) => line.startsWith('-') || line.startsWith('•'))
                .map((line) => line.replace(/^[-•]\s*/, ''));
            return { title, items };
        });

        return { sections };
    }

    async analyzeCvWithJD(fileBuffer: Buffer, jd: string): Promise<any> {
    const cvText = (await pdfParse(fileBuffer)).text;

    const prompt = `
Bạn là chuyên gia tuyển dụng.

Hãy đánh giá mức độ phù hợp của ứng viên dựa trên:

**Job Description (JD):**
${jd}

**CV của ứng viên:**
${cvText}

Trả lời dưới dạng JSON gồm 3 phần:
- "positivePoints": liệt kê các điểm mạnh trong CV phù hợp với JD
- "improvementAreas": liệt kê các điểm còn thiếu hoặc cần cải thiện
- "score": số điểm từ 0 đến 100 đánh giá mức độ phù hợp tổng thể, kèm mô tả ngắn (tối đa 1-2 câu)

Ví dụ:
{
  "positivePoints": ["Có kinh nghiệm Node.js", "Đã làm việc với MongoDB"],
  "improvementAreas": ["Thiếu kỹ năng quản lý dự án", "Chưa có chứng chỉ AWS"],
  "score": {
    "value": 78,
    "explanation": "Ứng viên đáp ứng được phần lớn yêu cầu nhưng thiếu kinh nghiệm triển khai hệ thống lớn."
  }
}
`;

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

    const content = res.data.choices[0].message.content;

    try {
        return JSON.parse(content);
    } catch (e) {
        return { raw: content };
    }
}

async recommendJobsBasedOnUserCv(userId: string): Promise<any> {
  // 1. Lấy CV URL từ user
      const user = await this.cVModel.findById(userId).exec();
      console.log('User CV URL:', user);

  // 2. Tải file CV từ URL
  

  // 4. Lấy danh sách công việc
  const jobs = await this.recruitmentService.findAll();

  // 5. Tạo prompt
  const prompt = `
Bạn là chuyên gia tuyển dụng.

Dưới đây là CV ứng viên:
"""
${user?.content || 'Không có CV.'}
"""

Và danh sách các công việc:
${jobs.map((job, index) => `\n${index + 1}. ${job.title} tại ${job.company}\nJD: ${job.description || job.requirements || job.keyResponsibilities}\n`).join('')}

Dựa trên nội dung CV và mô tả các công việc, hãy chọn ra những công việc phù hợp nhất. Trả về dạng JSON như sau:

[
  {
    "jobIndex": 1,
    "jobTitle": "Frontend Developer",
    "company": "FPT Software",
    "matchScore": 87,
    "reason": "Ứng viên có kinh nghiệm React và Tailwind, phù hợp với yêu cầu."
  },
  ...
]

Chỉ liệt kê tối đa 5 công việc phù hợp nhất, sắp xếp theo điểm giảm dần.
`;

  // 6. Gửi tới AI
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

  const content = res.data.choices[0].message.content;

  try {
    const recommendations = JSON.parse(content);
    // Gắn thêm job details từ index
    const enriched = recommendations.map((r) => ({
      ...r,
      job: jobs[r.jobIndex - 1] || null,
    }));
    return enriched;
  } catch (e) {
    return { raw: content, error: 'Invalid JSON format from AI.' };
  }
}




}
