import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Event } from "@domain/entities/event.entity";
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { EventCreateDto } from '@application/dto/event-create.dto';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(createEventDto: EventCreateDto, userId: number): Promise<Event> {
    try {

      const newEvent = new Event({
        ...createEventDto,
        userId,
      });

      return await this.eventRepository.create(newEvent);

    } catch (error) {
      throw new BadRequestException(
        error.message || 'An error occurred while creating the event',
      );
    }
  }
}