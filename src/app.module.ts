import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './infraestructure/controllers/EventController';
import { EventInMemoryRepository } from './infraestructure/repositories/EventInMemory.repository';
import { CreateEventUseCase } from './application/use-cases/CreateEvent';
import { DeleteEventUseCase } from './application/use-cases/DeleteEvent';
import { GetEventUseCase } from './application/use-cases/GetEvent';
import { UpdateEventUseCase } from './application/use-cases/UpdateEvent';
import { GetEventsUseCase } from './application/use-cases/GetEvents';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, EventController],
  providers: [
    AppService,
    {
      provide: 'IEventRepository',
      useClass: EventInMemoryRepository,
    },
    CreateEventUseCase,
    DeleteEventUseCase,
    GetEventUseCase,
    GetEventsUseCase,
    UpdateEventUseCase
  ],
})
export class AppModule {}