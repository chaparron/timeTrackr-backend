import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { EventUpdateDto } from '@application/dto/event-update.dto';
import { Event } from '@domain/entities/event.entity';

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) { }

  async execute(
    id: number,
    eventUpdateDto: EventUpdateDto,
    userId: number,
  ): Promise<Event | null> {
    const foundEvent = await this.eventRepository.findById(id);
    if (!foundEvent) throw new BadRequestException('Event not found');
    if (foundEvent.userId !== userId) throw new BadRequestException('Unauthorized. You can only update your own events');
    try {
      const updatedEvent = foundEvent.update(eventUpdateDto);

      if (eventUpdateDto.dates) {
        updatedEvent.dates = eventUpdateDto.dates;
        updatedEvent.updateTotalHours();
      }
      return this.eventRepository.update(id, updatedEvent);

    } catch (error) {
      throw new BadRequestException(
        `Error updating event id: ${id} from user ${userId} with ${eventUpdateDto}.\n Error message: ${error.message}`
      );
    }

  }
}