import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseMessage } from './decorators/response-message.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ResponseMessage('User data fetched successfully')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/error')
  throwError(): string {
    throw new HttpException('Custom error occurred', HttpStatus.BAD_REQUEST);
  }
}
