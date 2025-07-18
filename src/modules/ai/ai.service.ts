import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as pdfParse from 'pdf-parse';
@Injectable()
export class AiService {
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

    async generateInterviewQuestions(jd: string): Promise<{ checklist: string[] }> {
        const prompt = `
Bạn là một chuyên gia tuyển dụng kỹ thuật. Dưới đây là bản mô tả công việc:

"""${jd}"""

Hãy tạo danh sách các câu hỏi có thể được hỏi trong buổi phỏng vấn kỹ thuật, liên quan trực tiếp đến JD trên. Trình bày dưới dạng danh sách gạch đầu dòng.
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
Bạn là chuyên gia tuyển dụng. Hãy so sánh nội dung sau:

**Job Description (JD):**
${jd}

**CV:**
${cvText}

Trả lời dưới dạng JSON với 2 phần:
- "positivePoints": liệt kê các điểm mạnh trong CV phù hợp với JD
- "improvementAreas": liệt kê các điểm CV còn thiếu hoặc cần cải thiện để phù hợp hơn với JD
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
      return { raw: content }; // fallback nếu không phải JSON
    }
  }

}
