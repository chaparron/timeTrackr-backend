import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { EventUpdateDto } from '@application/dto/event-update.dto';
import { Event } from '@domain/entities/event.entity';

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string, eventUpdateDto: EventUpdateDto, userId: string): Promise<Event | null> {
    const foundEvent = await this.eventRepository.findById(id);
    console.log({foundEvent, userId})
    if (!foundEvent) {
      throw new Error('Event not found');
    }

    if (foundEvent.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const updatedEvent = foundEvent.update(eventUpdateDto);

    return this.eventRepository.update(id, updatedEvent);
  }
}