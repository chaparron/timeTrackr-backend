import { Controller, Post, Body, Put, Param, Get, Delete } from '@nestjs/common';
import { EventCreateDto } from '@application/dto/event-create.dto';
import { EventUpdateDto } from '@application/dto/event-update.dto';
import { CreateEventUseCase } from '@application/use-cases/CreateEvent';
import { DeleteEventUseCase } from '@application/use-cases/DeleteEvent';
import { GetEventUseCase } from '@application/use-cases/GetEvent';
import { GetEventsUseCase } from '@application/use-cases/GetEvents';
import { UpdateEventUseCase } from '@application/use-cases/UpdateEvent';

@Controller('events')
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly getEventUseCase: GetEventUseCase,
    private readonly getEventsUseCase: GetEventsUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
  ) {}

  @Post()
  async create(@Body() eventCreateDto: EventCreateDto) {
    return this.createEventUseCase.execute(eventCreateDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() eventUpdateDto: EventUpdateDto) {
    return this.updateEventUseCase.execute(id, eventUpdateDto);
  }

  @Get()
  async getAll() {
    return this.getEventsUseCase.execute();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.getEventUseCase.execute(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteEventUseCase.execute(id);
  }
}
