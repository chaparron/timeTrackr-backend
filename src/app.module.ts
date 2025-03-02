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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'time-trackr',
      entities: [Event, User],
      entitySkipConstructor: true,
      synchronize: true,
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