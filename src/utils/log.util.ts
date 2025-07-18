import * as fs from 'fs';
import * as path from 'path';

export function writeLogToFile(content: string, filename = 'cron-result.log') {
  const time = new Date().toLocaleString('vi-VN');
  const logMessage = `[${time}] ${content}\n`;
  const logPath = path.join(__dirname, '../../', filename);
  fs.appendFileSync(logPath, logMessage, { encoding: 'utf8' });
}