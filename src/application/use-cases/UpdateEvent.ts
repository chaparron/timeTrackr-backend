import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string, event: Partial<Event>) {
    return this.eventRepository.update(id, event);
  }
}