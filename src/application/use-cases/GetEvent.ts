import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '@domain/interfaces/IEventRepository';
import { Event } from '@domain/entities/event.entity';

@Injectable()
export class GetEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: number, userId: number): Promise<Event | null> {
    if (id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.eventRepository.findById(id);
  }
}
