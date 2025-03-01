import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infraestructure/controllers/AuthController';
import { LoginUseCase } from './application/use-cases/Login';
import { CreateUserUseCase } from './application/use-cases/CreateUser';
import { UserInMemoryRepository } from './infraestructure/repositories/UserInMemory.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: 'MySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    CreateUserUseCase,
    {
      provide: "IUserRepository",
      useClass: UserInMemoryRepository,
    },
  ],
})
export class AuthModule {}