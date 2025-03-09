import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type Duration = { hours: number; minutes: number };

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @Column()
  type?: string;

  @Column('jsonb', { nullable: true })
  colleagues?: string[];

  @Column('jsonb')
  dates: {
    day: string;
    hours: {
      start: string;
      end: string;
      duration?: Duration;
    }[];
    duration?: Duration;
  }[];

  @Column('text', { nullable: true })
  description?: string;

  @Column('jsonb')
  totalHours: Duration;

  constructor(props?: Partial<Omit<Event, 'totalHours' | 'dates'> & { 
    dates: Array<{
      day: string;
      hours: Array<{
        start: string;
        end: string;
      }>;
    }>;
  }>) {
    if (props) {
      if (!props.userId || !props.title || !props.dates) {
        throw new Error('userId, title, and dates are required to create an Event.');
      }
      

      this.title = props.title;
      this.userId = props.userId;
      this.type = props.type;
      this.colleagues = props.colleagues;
      this.description = props.description;
      
      this.dates = props.dates.map(day => ({
        day: day.day,
        hours: day.hours.map(hour => ({
          start: hour.start,
          end: hour.end,
          duration: { hours: 0, minutes: 0 }
        })),
        duration: { hours: 0, minutes: 0 }
      }));

      this.updateTotalHours();
    }
  }

  validateDates(): void {
    if (!this.dates) return;

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

  updateTotalHours(): Duration {
    this.validateDates();

    let totalMinutes = 0;

    this.dates.forEach(dayEntry => {
      let dayMinutes = 0;

      dayEntry.hours.forEach(hourEntry => {
        const start = new Date(`${dayEntry.day}T${hourEntry.start}`);
        const end = new Date(`${dayEntry.day}T${hourEntry.end}`);
        const diffMs = end.getTime() - start.getTime();
        const minutes = Math.floor(diffMs / 60000);

        hourEntry.duration = {
          hours: Math.floor(minutes / 60),
          minutes: minutes % 60
        };

        dayMinutes += minutes;
      });

      dayEntry.duration = {
        hours: Math.floor(dayMinutes / 60),
        minutes: dayMinutes % 60
      };

      totalMinutes += dayMinutes;
    });

    this.totalHours = {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };

    return this.totalHours;
  }

  update(eventUpdateData: Partial<Event>): Event {
    Object.assign(this, eventUpdateData);

    if (eventUpdateData.dates) {
      this.updateTotalHours();
    }

    return this;
  }
}