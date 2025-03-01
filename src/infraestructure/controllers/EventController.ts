import { Controller, Post, Body, Put, Param, Get, Delete, UseGuards } from '@nestjs/common';
import { EventCreateDto } from '@application/dto/event-create.dto';
import { EventUpdateDto } from '@application/dto/event-update.dto';
import { CreateEventUseCase } from '@application/use-cases/CreateEvent';
import { DeleteEventUseCase } from '@application/use-cases/DeleteEvent';
import { GetEventUseCase } from '@application/use-cases/GetEvent';
import { UpdateEventUseCase } from '@application/use-cases/UpdateEvent';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'infraestructure/decorators/current-user.decorator';
import { getEventsByUserUseCase } from '@application/use-cases/getEventsByUser';

@Controller('events')
@UseGuards(AuthGuard('jwt'))	
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly getEventUseCase: GetEventUseCase,
    private readonly getEventsByUserUseCase: getEventsByUserUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
  ) {}

  @Post()
  async create(
    @Body() eventCreateDto: EventCreateDto,
    @CurrentUser() user: {userId: string}
  ) {
    return this.createEventUseCase.execute(
      eventCreateDto,
      user.userId
    )
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() eventUpdateDto: EventUpdateDto,
    @CurrentUser() user: {userId: string}
  ) {
    return this.updateEventUseCase.execute(id, eventUpdateDto, user.userId);
  }

  @Get()
  async getAllByUser(@CurrentUser() user: {userId: string}) {
    return this.getEventsByUserUseCase.execute(user.userId);
  }

  @Get(':id')
  async get(
    @Param('id') id: string,
    @CurrentUser() user: {userId: string}
  ) {
    return this.getEventUseCase.execute(id, user.userId);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: {userId: string}
  ) {
    return this.deleteEventUseCase.execute(id, user.userId);
  }
}
