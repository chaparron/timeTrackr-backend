import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { RedisService } from '@infrastructure/services/redis.service';
import { Event } from '@domain/entities/event.entity';

@Injectable()
export class getEventsByUserUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private redisService: RedisService,
  ) {}

  async execute(userId: number) {
    const cacheKey = `events_user_${userId}`;

    const cachedEvents = await this.redisService.get<Event>(cacheKey);
    if (cachedEvents) {
      return cachedEvents;
    }

    const userEvents = await this.eventRepository.findAllByUserId(userId);

    await this.redisService.set(cacheKey, userEvents);

    return userEvents;
  }
}