import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Article } from '../types/article';
import { User } from '../types/user';
import { CreateArticleDTO, UpdateArticleDTO } from './article.dto';

@Injectable()
export class ArticleService {
  constructor(@InjectModel('Article') private articleModel: Model<Article>) { }

  async findAll(resPerPage, page): Promise<Article[]> {
    // console.log('findAll', resPerPage, page)
    return await this.articleModel.find().skip((resPerPage * page) - resPerPage).limit(resPerPage).populate('author');
  }

  async findCount(): Promise<number> {
    return await this.articleModel.find().countDocuments();
  }

  async findByAuthor(userId: string): Promise<Article[]> {
    return await this.articleModel.find({ author: userId }).populate('author');
  }

  async findById(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).populate('author');
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NO_CONTENT);
    }
    return article;
  }

  async create(articleDTO: CreateArticleDTO, user: User): Promise<Article> {
    const article = await this.articleModel.create({
      ...articleDTO,
      author: user,
    });
    await article.save();
    return article.populate('author');
  }

  async update(
    id: string,
    articleDTO: UpdateArticleDTO,
    userId: string,
  ): Promise<Article> {
    const article = await this.articleModel.findById(id);
    if (userId !== article.author.toString()) {
      throw new HttpException(
        'You do not own this article',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await article.update(articleDTO);
    return await this.articleModel.findById(id).populate('author');
  }

  async updateRatingUp(
    id: string
  ): Promise<Article> {
    return await this.articleModel.findOneAndUpdate({ _id: id }, { $inc: { rating: 1 } });
    // return await this.articleModel.findById(id).populate('author');
  }

  async updateRatingDown(
    id: string
  ): Promise<Article> {
    return await this.articleModel.findOneAndUpdate({ _id: id }, { $inc: { rating: -1 } });
    // return await this.articleModel.findById(id).populate('author');
  }

  async delete(id: string, userId: string): Promise<Article> {
    const article = await this.articleModel.findById(id);
    if (userId !== article.author.toString()) {
      throw new HttpException(
        'You do not own this article',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await article.remove();
    return article.populate('author');
  }
}
