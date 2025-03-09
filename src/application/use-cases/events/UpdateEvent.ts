import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IEventRepository } from '@domain/interfaces/IEventRepository';
import { EventUpdateDto } from '@application/dto/events/event-update.dto';
import { Event } from '@domain/entities/event.entity';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private readonly redisService: RedisService,
  ) {}

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

      const result = await this.eventRepository.update(id, updatedEvent);

      const eventCacheKey = `event_${id}`;
      await this.redisService.del(eventCacheKey);
      const userEventsCacheKey = `events_user_${userId}`;
      await this.redisService.del(userEventsCacheKey);

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Error updating event id: ${id} from user ${userId} with ${eventUpdateDto}.\n Error message: ${error.message}`,
      );
    }
  }
}