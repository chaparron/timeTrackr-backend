import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column('jsonb', { nullable: true })
  colleagues?: string[];

  @Column('jsonb')
  dates?: { day: string; hours: { start: string; end?: string }[] }[];

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  totalHours: number;

  constructor(props?: Partial<Omit<Event, 'totalHours'>>) {
    if (props) {
      if (!props.userId || !props.title) {
        throw new Error('userId and title are required to create an Event.');
      }
      Object.assign(this, props);
      this.updateTotalHours();
    }
  }

  validateDates(): void {
    if (!this.dates || this.dates.length === 0) return;

    for (const dayEntry of this.dates) {
      const dayDate = new Date(dayEntry.day);
      if (isNaN(dayDate.getTime())) {
        throw new Error(`Invalid day format: ${dayEntry.day}, must be YYYY-MM-DD`);
      }

      for (const hourEntry of dayEntry.hours) {
        const startDateTime = new Date(`${dayEntry.day}T${hourEntry.start}`);
        if (isNaN(startDateTime.getTime())) {
          throw new Error(`Invalid start time format: ${hourEntry.start} for day ${dayEntry.day}`);
        }

        if (hourEntry.end) {
          const endDateTime = new Date(`${dayEntry.day}T${hourEntry.end}`);
          if (isNaN(endDateTime.getTime())) {
            throw new Error(`Invalid end time format: ${hourEntry.end} for day ${dayEntry.day}`);
          }

          if (startDateTime > endDateTime) {
            throw new Error(`Start time ${hourEntry.start} must be before end time ${hourEntry.end} on day ${dayEntry.day}`);
          }
        }
      }
    }
  }

  updateTotalHours(): number {
    this.validateDates();
    if (!this.dates || this.dates.length === 0) {
      this.totalHours = 0;
      return 0;
    }

    let total = 0;
    for (const dayEntry of this.dates) {
      for (const hourEntry of dayEntry.hours) {
        const start = new Date(`${dayEntry.day}T${hourEntry.start}`).getTime();
        const end = hourEntry.end ? new Date(`${dayEntry.day}T${hourEntry.end}`).getTime() : 0;
        
        if (end > 0) {
          total += (end - start) / (1000 * 60 * 60);
        }
      }
    }
    this.totalHours = total;
    return total;
  }

  update(eventUpdateData: Partial<Event>): Event {
    const filteredUpdate = Object.fromEntries(
      Object.entries(eventUpdateData).filter(([_, value]) => value !== undefined),
    );

    Object.assign(this, filteredUpdate);

    if (eventUpdateData.dates) {
      this.updateTotalHours();
    }

    return this;
  }
}