import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '@domain/interfaces/IEventRepository';
import { Event } from '@domain/entities/event.entity';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class GetEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(id: number, userId: number): Promise<Event | null> {
    
    const cacheKey = `event_${id}`;
    
    const cachedEvent = await this.redisService.get<Event>(cacheKey);
    if (cachedEvent) {
      return cachedEvent;
    }
    
    const event = await this.eventRepository.findById(id);
    
    if (event?.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (event) {
      await this.redisService.set(cacheKey, event);
    }

    return event;
  }
}