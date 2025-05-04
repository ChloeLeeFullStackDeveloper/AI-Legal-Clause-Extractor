import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || '.pdf,.doc,.docx').split(','),
  }
};

if (!config.openai.apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI functionality will not work.');
}