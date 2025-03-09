import { Event } from './event.entity';

describe('Event Entity', () => {

  it('should create an event instance with required properties', () => {
    const eventData = {
      id: 1,
      title: 'Team Meeting',
      userId: 123,
    };

    const event = new Event(eventData);

    expect(event).toBeDefined();
    expect(event.id).toEqual(eventData.id);
    expect(event.title).toEqual(eventData.title);
    expect(event.userId).toEqual(eventData.userId);
    expect(event.totalHours).toEqual(0);
  });

  it('should throw an error if userId or title is missing', () => {
    const invalidEventData = [
      { id: 1, title: 'Team Meeting' },
      { id: 1, userId: 123 },
      { id: 1 },
    ];

    invalidEventData.forEach((data) => {
      expect(() => new Event(data as any)).toThrow();
    });
  });

  it('should accept valid dates', () => {
    const validDates = [
      {
        day: '2023-10-01',
        hours: [
          { start: '09:00', end: '10:00' },
          { start: '11:00' }
        ]
      }
    ];

    const event = new Event({
      id: 1,
      title: 'Team Meeting',
      userId: 123,
      dates: validDates,
    });

    expect(event.dates).toEqual(validDates);
  });

  it('should reject invalid dates', () => {
    const invalidDates = [
      { day: '2023-13-01', hours: [{ start: '09:00' }] },
      { day: '2023-10-01', hours: [{ start: '25:00' }] },
      { day: '2023-10-01', hours: [{ start: '10:00', end: '09:00' }] }
    ];

    invalidDates.forEach((dates) => {
      expect(() => {
        new Event({
          id: 1,
          title: 'Team Meeting',
          userId: 123,
          dates: [dates],
        });
      }).toThrow();
    });
  });

  it('should calculate totalHours correctly', () => {
    const eventData = {
      id: 1,
      title: 'Team Meeting',
      userId: 123,
      dates: [
        {
          day: '2023-10-01',
          hours: [
            { start: '09:00', end: '10:00' },
            { start: '11:00', end: '13:00' }
          ]
        },
        {
          day: '2023-10-02',
          hours: [
            { start: '09:00', end: '12:00' }
          ]
        }
      ],
    };

    const event = new Event(eventData);
    expect(event.totalHours).toEqual(6);
  });
});