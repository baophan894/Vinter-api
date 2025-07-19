import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadBuffer(buffer: Buffer, filename: string, folder = 'speech'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: 'video',
          format: 'mp3',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) return reject(new Error('Upload failed: No result or secure_url returned.'));
          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

   async uploadPdfBuffer(buffer: Buffer, filename: string, folder = 'cv'): Promise<{ url: string; content: string }> {
    const pdfText = await pdfParse(buffer).then(data => data.text);

    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: 'raw',
          format: 'pdf',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) return reject(new Error('Upload failed'));
          resolve(result.secure_url);
        },
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return {url, content: pdfText };
  }
}
