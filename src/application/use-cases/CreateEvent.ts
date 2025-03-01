import { Injectable, Inject } from '@nestjs/common';
import { Event } from "@domain/entities/event.entity";
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { EventCreateDto } from '@application/dto/event-create.dto';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(createEventDto: EventCreateDto, userId: string): Promise<Event> {
    const newEvent = new Event({...createEventDto, userId });
    return this.eventRepository.create(newEvent);
  }
}