import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "@domain/interfaces/IEventRepository";

@Injectable()
export class getEventsByUserUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(userId: number) {
    return this.eventRepository.findAllByUserId(userId);
  }
}