import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ArticleModule } from './article/article.module';
import { InitSlackModule } from './initSlack/InitSlack.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    SharedModule,
    AuthModule,
    ArticleModule,
    InitSlackModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
