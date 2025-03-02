import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '@application/dto/createuser-dto';
import { LoginDto } from '@application/dto/login.dto';
import { CreateUserUseCase } from '@application/use-cases/CreateUser';
import { LoginUseCase } from '@application/use-cases/Login';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return {
      access_token: await this.loginUseCase.execute(
        loginDto.email,
        loginDto.password,
      ),
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(createUserDto);
    return {
      email: user.email,
      username: user.username,
    };
  }
}