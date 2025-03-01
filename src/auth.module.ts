import { CreateUserUseCase } from '@application/use-cases/CreateUser';
import { LoginUseCase } from '@application/use-cases/Login';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'infraestructure/controllers/AuthController';
import { UserInMemoryRepository } from 'infraestructure/repositories/UserInMemory.repository';
import { JwtStrategy } from 'infraestructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'MySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    CreateUserUseCase,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserInMemoryRepository,
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}