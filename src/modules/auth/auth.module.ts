// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCron } from './auth.cron';

@Module({
  providers: [AuthService, AuthCron],
  controllers: [AuthController],
})
export class AuthModule {}
