import * as dotenv from 'dotenv';
dotenv.config();

export const AES_ALGORITHM = process.env.AES_ALGORITHM || 'aes-256-cbc';
export const AES_SECRET = process.env.AES_SECRET as string;
export const AES_IV = process.env.AES_IV as string;
