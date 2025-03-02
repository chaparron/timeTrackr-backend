import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const userCacheKey = `events_user_${userId}`;
    await this.redisService.del(userCacheKey);
    const eventCacheKey = `event_${id}`;
    await this.redisService.del(eventCacheKey);
    
    return await this.eventRepository.delete(id);
  }
}