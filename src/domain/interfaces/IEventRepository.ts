import { EventCreateDto } from "src/application/dto/event-create.dto";
import { EventUpdateDto } from "src/application/dto/event-update.dto";
import { Event } from "src/domain/entities/event.entity";

export interface IEventRepository {
  create(eventCreateDto: EventCreateDto): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
  update(id: string, eventUpdateDto: EventUpdateDto): Promise<Event | null>;
  delete(id: string): Promise<void>;
}