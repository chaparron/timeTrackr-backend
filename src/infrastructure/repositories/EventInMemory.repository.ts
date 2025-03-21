import { Injectable } from "@nestjs/common";
import { Event } from "@domain/entities/event.entity";
import { IEventRepository } from "@domain/interfaces/IEventRepository";

@Injectable()
export class EventInMemoryRepository implements IEventRepository {
  private events: Event[] = [];

  async create(event: Event): Promise<Event> {
    this.events.push(event);
    return event;
  }

  async findById(id: number): Promise<Event | null> {
    return this.events.find((event) => event.id === id) || null;
  }

  async findAllByUserId(userId: number): Promise<Event[]> {
    return this.events.filter(event => event.userId === userId);
  }

  async update(id: number, updatedEvent: Event): Promise<Event | null> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return null;

    const existingEvent = this.events[index];

    existingEvent.update(updatedEvent);

    return existingEvent;
  }

  async delete(id: number): Promise<void> {
    this.events = this.events.filter((event) => event.id !== id);
  }
}