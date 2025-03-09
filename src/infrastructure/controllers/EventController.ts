import { Controller, Post, Body, Put, Param, Get, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { EventCreateDto } from '@application/dto/events/event-create.dto';
import { EventUpdateDto } from '@application/dto/events/event-update.dto';
import { CreateEventUseCase } from '@application/use-cases/events/CreateEvent';
import { DeleteEventUseCase } from '@application/use-cases/events/DeleteEvent';
import { GetEventUseCase } from '@application/use-cases/events/GetEvent';
import { UpdateEventUseCase } from '@application/use-cases/events/UpdateEvent';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@infrastructure/decorators/current-user.decorator';
import { getEventsByUserUseCase } from '@application/use-cases/events/getEventsByUser';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly getEventUseCase: GetEventUseCase,
    private readonly getEventsByUserUseCase: getEventsByUserUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: EventCreateDto })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(
    @Body() eventCreateDto: EventCreateDto,
    @CurrentUser() user: { userId: number },
  ) {
    return this.createEventUseCase.execute(eventCreateDto, user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiParam({ name: 'id', description: 'Event ID', example: 1 })
  @ApiBody({ type: EventUpdateDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() eventUpdateDto: EventUpdateDto,
    @CurrentUser() user: { userId: number },
  ) {
    const eventId = parseInt(id, 10);
    return this.updateEventUseCase.execute(eventId, eventUpdateDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events for the current user' })
  @ApiResponse({ status: 200, description: 'List of events' })
  async getAllByUser(@CurrentUser() user: { userId: number }) {
    return this.getEventsByUserUseCase.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Event found' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async get(
    @Param('id') id: string,
    @CurrentUser() user: { userId: number },
  ) {
    const eventId = parseInt(id, 10);
    return this.getEventUseCase.execute(eventId, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID', example: 1 })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { userId: number },
  ) {
    const eventId = parseInt(id, 10);
    return this.deleteEventUseCase.execute(eventId, user.userId);
  }
}