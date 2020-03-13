import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArticleSchema } from '../models/article.schema';
import { SharedModule } from '../shared/shared.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
    SharedModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
