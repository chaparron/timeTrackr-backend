import { Event } from '@domain/entities/event.entity';
import { IEventRepository } from '@domain/interfaces/IEventRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventTypeOrmRepository implements IEventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(event: Event): Promise<Event> {
    return await this.eventRepository.save(event);
  }

  async findById(id: number): Promise<Event | null> {
    const foundEvent = await this.eventRepository.findOne({ 
      where: { id } 
    });
    return foundEvent
  }

  async findAllByUserId(userId: number): Promise<Event[]> {
    return await this.eventRepository.find({ where: {  userId } });
  }

  async update(id: number, event: Event): Promise<Event | null> {
    await this.eventRepository.update(id, event);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }
}