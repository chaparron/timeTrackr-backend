import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './infraestructure/controllers/EventController';
import { EventInMemoryRepository } from './infraestructure/repositories/EventInMemory.repository';
import { CreateEventUseCase } from './application/use-cases/CreateEvent';
import { DeleteEventUseCase } from './application/use-cases/DeleteEvent';
import { GetEventUseCase } from './application/use-cases/GetEvent';
import { UpdateEventUseCase } from './application/use-cases/UpdateEvent';
import { AuthModule } from './auth.module';
import { getEventsByUserUseCase } from '@application/use-cases/getEventsByUser';

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
    getEventsByUserUseCase,
    UpdateEventUseCase
  ],
})
export class AppModule {}