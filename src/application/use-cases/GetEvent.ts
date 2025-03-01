import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '@domain/interfaces/IEventRepository';

@Injectable()
export class GetEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string, userId: string) {
    if (id !== userId) {
      throw new Error('Unauthorized');
    }
    return this.eventRepository.findById(id);
  }
}
