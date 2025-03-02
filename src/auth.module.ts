import { CreateUserUseCase } from '@application/use-cases/CreateUser';
import { LoginUseCase } from '@application/use-cases/Login';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@infrastructure/controllers/AuthController';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { InfrastructureModule } from 'infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    InfrastructureModule
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    CreateUserUseCase,
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}