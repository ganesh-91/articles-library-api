import { Module } from '@nestjs/common';

import { InitSlackController } from './initSlack.controller';


@Module({
  controllers: [InitSlackController],
})
export class InitSlackModule { }
