import { EventUpdateDto } from "@application/dto/event-update.dto";
import { Event } from "@domain/entities/event.entity";

export interface IEventRepository {
  create(event: Event): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findAllByUserId(userId: string): Promise<Event[]>
  update(id: string, eventUpdateDto: EventUpdateDto): Promise<Event | null>;
  delete(id: string): Promise<void>;
}