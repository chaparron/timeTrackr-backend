import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Event } from "@domain/entities/event.entity";
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { EventCreateDto } from '@application/dto/event-create.dto';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(createEventDto: EventCreateDto, userId: number): Promise<Event> {
    try {

      const newEvent = new Event({
        ...createEventDto,
        userId,
      });

      const createdEvent = await this.eventRepository.create(newEvent);

      const cacheKey = `events_user_${userId}`;
      await this.redisService.del(cacheKey);

      return createdEvent

    } catch (error) {
      throw new BadRequestException(
        error.message || 'An error occurred while creating the event',
      );
    }
  }
}