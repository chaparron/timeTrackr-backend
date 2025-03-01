import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    if (id !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.eventRepository.delete(id);
  }
}