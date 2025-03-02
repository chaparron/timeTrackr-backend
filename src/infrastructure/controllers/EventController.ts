import { Controller, Post, Body, Put, Param, Get, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { EventCreateDto } from '@application/dto/event-create.dto';
import { EventUpdateDto } from '@application/dto/event-update.dto';
import { CreateEventUseCase } from '@application/use-cases/CreateEvent';
import { DeleteEventUseCase } from '@application/use-cases/DeleteEvent';
import { GetEventUseCase } from '@application/use-cases/GetEvent';
import { UpdateEventUseCase } from '@application/use-cases/UpdateEvent';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
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
    @CurrentUser() user: {userId: number}
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
    @CurrentUser() user: {userId: number}
  ) {
    const eventId = parseInt(id, 10)
    console.log({eventId, eventUpdateDto, user})
    return this.updateEventUseCase.execute(eventId, eventUpdateDto, user.userId);
  }

  @Get()
  async getAllByUser(@CurrentUser() user: {userId: number}) {
    return this.getEventsByUserUseCase.execute(user.userId);
  }

  @Get(':id')
  async get(
    @Param('id') id: string,
    @CurrentUser() user: {userId: number}
  ) {
    const eventId = parseInt(id, 10)
    return this.getEventUseCase.execute(eventId, user.userId);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: {userId: number}
  ) {
    const eventId = parseInt(id, 10)
    return this.deleteEventUseCase.execute(eventId, user.userId);
  }
}
