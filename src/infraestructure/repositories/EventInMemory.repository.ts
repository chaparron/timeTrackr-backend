import { Injectable } from "@nestjs/common";
import { EventCreateDto } from "src/application/dto/event-create.dto";
import { EventUpdateDto } from "src/application/dto/event-update.dto";
import { Event } from "src/domain/entities/event.entity";
import { IEventRepository } from "src/domain/interfaces/IEventRepository";

@Injectable()
export class EventInMemoryRepository implements IEventRepository {
  private events: Event[] = [];

  async create(eventCreateDto: EventCreateDto): Promise<Event> {
    const event = new Event({...eventCreateDto});
    this.events.push(event);
    return event;
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find((event) => event.id === id) || null;
  }

  async findAll(): Promise<Event[]> {
    return this.events;
  }

  async update(id: string, eventUpdateDto: EventUpdateDto): Promise<Event | null> {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return null;
  
    const existingEvent = this.events[index];
  
    existingEvent.update({
      title: eventUpdateDto.title,
      type: eventUpdateDto.type,
      colleagues: eventUpdateDto.colleagues,
      dates: eventUpdateDto.dates,
      description: eventUpdateDto.description
    });
  
    return existingEvent;
  }
  

  async delete(id: string): Promise<void> {
    this.events = this.events.filter((event) => event.id !== id);
  }
}