import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { Article } from '../types/article';
import { User as UserDocument } from '../types/user';
import { User } from '../utilities/user.decorator';
import { CreateArticleDTO, UpdateArticleDTO, SlackArticleDTO } from './article.dto';
import { ArticleService } from './article.service';
import { Response } from "../types/response";
import * as Crawler from "crawler";
import { async } from 'rxjs/internal/scheduler/async';
import { UserService } from '../shared/user.service';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService,
    private userService: UserService) { }

  @Get()
  async listAll(@Query('resPerPage') resPerPage: string, @Query('page') page: string): Promise<Response> {
    // console.log('resPerPage, page', resPerPage, page)
    let data = await this.articleService.findAll(parseInt(resPerPage), parseInt(page));
    let count = await this.articleService.findCount();
    // console.log('data', data)
    let pagination = {
      count,
      resPerPage: parseInt(resPerPage),
      page: parseInt(page)
    };
    return { data, pagination };
  }

  @Get('/mine')
  @UseGuards(AuthGuard('jwt'))
  async listMine(@User() user: UserDocument): Promise<Response> {
    const { id } = user;
    let data = await this.articleService.findByAuthor(id);
    let pagination = {};
    return { data, pagination };
  }

  @Get('/user/:id')
  async listBySeller(@Param('id') id: string): Promise<Response> {
    let data = await this.articleService.findByAuthor(id);
    let pagination = {};
    return { data, pagination };
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() article: SlackArticleDTO
  ): Promise<Article> {

    const user = await this.userService.findByUserName(article.user_name);
    console.log('user_user', user)
    // const { url } = article;
    let data: CreateArticleDTO = {
      url: '',
      title: '',
      image: '',
      description: '',
      rating: 0
    }
    console.log('article', article)
    // console.log('article.text.url', article.text.split(':'))
    let mySubString = article.text.substring(
      article.text.lastIndexOf("+<") + 2,
      article.text.lastIndexOf("+>")
    );

    console.log('mySubString', mySubString)

    let promise = new Promise(function (resolve, reject) {
      // executor (the producing code, "singer")
      var c = new Crawler({
        maxConnections: 10,
        callback: function (error, res, done) {
          if (error) {
            reject(error)
          } else {
            var $ = res.$;
            console.log($("domain").text())
            resolve($("title").text())
          }
          done();
        }
      });
      c.queue(mySubString);
    });
    await promise.then((res: string) => {
      data.url = mySubString;
      data.title = res;
    }).catch((err) => {
      console.log('err', err)
    });

    return await this.articleService.create(data, user);
  }

  @Get(':id')
  async read(@Param('id') id: string): Promise<Article> {
    return await this.articleService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() article: UpdateArticleDTO,
    @User() user: UserDocument,
  ): Promise<Article> {
    const { id: userId } = user;
    return await this.articleService.update(id, article, userId);
  }

  @Put('/rate/:id/:action')
  @UseGuards(AuthGuard('jwt'))
  async updateRating(
    @Param('id') id: string,
    @Param('action') action: string
  ): Promise<Article> {
    if (action === "UP") {
      return await this.articleService.updateRatingUp(id);
    } else if (action === "DOWN") {
      return await this.articleService.updateRatingDown(id);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('id') id: string,
    @User() user: UserDocument,
  ): Promise<Article> {
    const { id: userId } = user;
    return await this.articleService.delete(id, userId);
  }
}

// @WebSocketGateway()
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

//     @WebSocketServer() server;
//     users: number = 0;

//     async handleConnection() {

//         // A client has connected
//         this.users++;

//         // Notify connected clients of current users
//         this.server.emit('users', this.users);

//     }

//     async handleDisconnect() {

//         // A client has disconnected
//         this.users--;

//         // Notify connected clients of current users
//         this.server.emit('users', this.users);

//     }

//     @SubscribeMessage('chat')
//     async onChat(client, message) {
//         client.broadcast.emit('chat', message);
//     }

// }