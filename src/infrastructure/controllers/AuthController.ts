import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '@application/dto/users/user-create.dto';
import { LoginDto } from '@application/dto/users/user-login.dto';
import { CreateUserUseCase } from '@application/use-cases/auth/CreateUser';
import { LoginUseCase } from '@application/use-cases/auth/Login';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
import { GetUserDetailsUseCase } from '@application/use-cases/auth/GetUserDetails';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserDetailsUseCase: GetUserDetailsUseCase,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User details' })
  @ApiResponse({ status: 200, description: 'User details obtained' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async getUserDetails(
    @CurrentUser() user: { userId: number },
  ) {
    return await this.getUserDetailsUseCase.execute(user.userId);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const { token, user } = await this.loginUseCase.execute(
      loginDto.email,
      loginDto.password
    );

    return {
      access_token: token,
      user
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(createUserDto);
    const { token } = await this.loginUseCase.execute(user.email, createUserDto.password);
    return {
      access_token: token,
      user: {
        email: user.email,
        username: user.username
      }
    };
  }
}