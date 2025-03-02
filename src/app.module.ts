import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateEventUseCase } from '@application/use-cases/CreateEvent';
import { DeleteEventUseCase } from '@application/use-cases/DeleteEvent';
import { GetEventUseCase } from '@application/use-cases/GetEvent';
import { UpdateEventUseCase } from '@application/use-cases/UpdateEvent';
import { AuthModule } from './auth.module';
import { InfrastructureModule } from './infrastructure.module';
import { getEventsByUserUseCase } from '@application/use-cases/getEventsByUser';
import { User } from '@domain/entities/user.entity';
import { Event } from '@domain/entities/event.entity';
import { EventController } from '@infrastructure/controllers/EventController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
      synchronize: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    InfrastructureModule
  ],
  controllers: [AppController, EventController],
  providers: [
    AppService,
    CreateEventUseCase,
    DeleteEventUseCase,
    GetEventUseCase,
    getEventsByUserUseCase,
    UpdateEventUseCase,
  ],
})
export class AppModule {}