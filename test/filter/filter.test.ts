import { Controller, Get } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  throwError() {
    throw new HttpException('의도적인 에러 발생', HttpStatus.BAD_REQUEST);
  }
}
