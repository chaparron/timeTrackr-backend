import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column('jsonb', { nullable: true })
  colleagues?: string[];

  @Column('jsonb')
  dates?: { start: string; end?: string }[];

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  totalHours: number;

  @Column()
  userId: number;

  constructor(props?: Partial<Omit<Event, 'totalHours'>>) {
    if (props) {
      Object.assign(this, props);
      this.updateTotalHours();
    }
  }

  validateDates(): void {
    if (!this.dates || this.dates.length === 0) return;

    for (const date of this.dates) {
      const start = new Date(date.start).getTime();
      if (isNaN(start)) {
        throw new Error(`Invalid start date format, ${date.start}, shoud be YYYY-MM-DDThh:mm:ss`);
      }

      if (date.end) {
        const end = new Date(date.end).getTime();
        if (isNaN(end)) {
          throw new Error(`Invalid end date format, ${date.end}, shoud be YYYY-MM-DDThh:mm:ss`);
        }

        if (start > end) {
          throw new Error('Start date must be before end date');
        }
      }
    }
  }

  updateTotalHours(): number {
    this.validateDates()
    if (!this.dates || this.dates.length === 0) return 0;

    let total = 0;
    for (const date of this.dates) {
      const start = new Date(date.start).getTime();
      if (!date.end) continue;
      const end = new Date(date.end).getTime();
      total += (end - start) / (1000 * 60 * 60);
    }
    this.totalHours = total;
    return total;
  }

  update(eventUpdateData: Partial<Event>): Event {
    const filteredUpdate = Object.fromEntries(
      Object.entries(eventUpdateData).filter(([_, value]) => value !== undefined)
    );

    Object.assign(this, filteredUpdate);

    if (eventUpdateData.dates) {
      this.updateTotalHours();
    }

    return this;
  }
}