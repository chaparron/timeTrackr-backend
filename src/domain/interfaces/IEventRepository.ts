import { EventUpdateDto } from "@application/dto/event-update.dto";
import { Event } from "@domain/entities/event.entity";

export interface IEventRepository {
  create(event: Event): Promise<Event>;
  findById(id: number): Promise<Event | null>;
  findAllByUserId(userId: number): Promise<Event[]>
  update(id: number, eventUpdateDto: EventUpdateDto): Promise<Event | null>;
  delete(id: number): Promise<void>;
}