import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from "src/domain/interfaces/IEventRepository";

@Injectable()
export class DeleteEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(id: string) {
    return this.eventRepository.delete(id);
  }
}