import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '@application/dto/createuser-dto';
import { LoginDto } from '@application/dto/login.dto';
import { CreateUserUseCase } from '@application/use-cases/CreateUser';
import { LoginUseCase } from '@application/use-cases/Login';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return {
      access_token: await this.loginUseCase.execute(
        loginDto.email,
        loginDto.password
      ),
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(createUserDto);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}