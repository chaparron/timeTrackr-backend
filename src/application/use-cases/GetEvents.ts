import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "src/domain/interfaces/IEventRepository";

@Injectable()
export class GetEventsUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute() {
    return this.eventRepository.findAll();
  }
}