import { Injectable, Inject } from '@nestjs/common';
import { Event } from "src/domain/entities/event.entity";
import { IEventRepository } from "src/domain/interfaces/IEventRepository";

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(createEventDto): Promise<Event> {
    const newEvent = new Event({...createEventDto});
    return this.eventRepository.create(newEvent);
  }
}