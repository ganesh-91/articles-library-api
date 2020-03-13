import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';

import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User as UserDocument } from '../types/user';
import { User } from '../utilities/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }

  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    const payload: Payload = {
      email: user.email
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    console.log('userDTO',userDTO)
    const user = await this.userService.create(userDTO);
    const payload: Payload = {
      email: user.email
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Get('check')
  @UseGuards(AuthGuard('jwt'))
  async checkMe(@User() user: UserDocument) {
    const { email } = user;
    const payload: Payload = {
      email
    };
    // await this.articleService.findByAuthor(id);
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Get()
  async getAll() {
    const user = await this.userService.find();
    return { user };
  }
}
