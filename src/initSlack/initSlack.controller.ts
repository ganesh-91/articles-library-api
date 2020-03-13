import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

@Controller('slack')
export class InitSlackController {
  constructor() { }

  @Post()
  async create(
    @Body() obj: any,
  ): Promise<any> {
    console.log('obj', obj)
    return obj;
  }

}