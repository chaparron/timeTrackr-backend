import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CreateEventUseCase } from '@application/use-cases/events/CreateEvent';
import { DeleteEventUseCase } from '@application/use-cases/events/DeleteEvent';
import { GetEventUseCase } from '@application/use-cases/events/GetEvent';
import { UpdateEventUseCase } from '@application/use-cases/events/UpdateEvent';
import { AuthModule } from './auth.module';
import { InfrastructureModule } from './infrastructure.module';
import { getEventsByUserUseCase } from '@application/use-cases/events/getEventsByUser';
import { User } from '@domain/entities/user.entity';
import { Event } from '@domain/entities/event.entity';
import { EventController } from '@infrastructure/controllers/EventController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Event, User],
      entitySkipConstructor: true,
      synchronize: true,
    }),
    AuthModule,
    InfrastructureModule,
    RedisModule,
  ],
  controllers: [AppController, EventController],
  providers: [
    CreateEventUseCase,
    DeleteEventUseCase,
    GetEventUseCase,
    getEventsByUserUseCase,
    UpdateEventUseCase,
  ],
})
export class AppModule {}