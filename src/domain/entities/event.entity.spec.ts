import { Event } from './event.entity';

describe('Event Entity', () => {
  it('should create an event instance with required properties', () => {
    const eventData = {
      id: 1,
      title: 'Team Meeting',
      userId: 123,
      dates: []
    };

    const event = new Event(eventData);

    expect(event).toBeDefined();
    expect(event.totalHours).toEqual({ hours: 0, minutes: 0 });
  });

  it('should throw error when missing required fields', () => {
    const invalidData = [
      { title: 'Meeting', dates: [] },
      { userId: 123, dates: [] },
      { title: 'Meeting', userId: 123 },
    ];

    invalidData.forEach(data => {
      expect(() => new Event(data as any)).toThrow('userId, title, and dates are required');
    });
  });

  it('should calculate durations correctly', () => {
    const event = new Event({
      title: 'Conference',
      userId: 123,
      dates: [
        {
          day: '2023-10-01',
          hours: [
            { start: '09:00', end: '11:30' },
            { start: '13:00', end: '14:45' } 
          ]
        }
      ]
    });

    expect(event.totalHours).toEqual({ hours: 4, minutes: 15 });
    expect(event.dates[0].duration).toEqual({ hours: 4, minutes: 15 });
    expect(event.dates[0].hours[0].duration).toEqual({ hours: 2, minutes: 30 });
  });
});