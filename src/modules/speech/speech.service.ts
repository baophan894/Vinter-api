import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class SpeechService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }


    async transcribeWithFPT(file: Express.Multer.File): Promise<any> {
        const filePath = path.resolve(file.path);

        const response = await axios.post(
            'https://api.fpt.ai/hmi/asr/general',
            fs.createReadStream(filePath),
            {
                headers: {
                    'api-key': process.env.FPT_API_KEY,
                    'Content-Type': 'application/octet-stream',
                },
            },
        );
        fs.unlink(filePath, () => { });
        return response.data;
    }

    async speakWithFPT(text: string): Promise<{ audioUrl: string }> {
    const response = await axios.post(
      'https://api.fpt.ai/hmi/tts/v5',
      text,
      {
        headers: {
          'api-key': process.env.FPT_API_KEY,
          'Content-Type': 'text/plain',
          voice: 'minhquang',
          speed: '0',
        },
      },
    );

    const audioUrl = response.data.async;

    if (!audioUrl) {
      throw new Error('FPT không trả về đường dẫn âm thanh');
    }

    return { audioUrl };
  }
}
