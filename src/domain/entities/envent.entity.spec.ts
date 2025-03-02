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
      { start: '2023-10-01T09:00:00', end: '2023-10-01T10:00:00' },
      { start: '2023-10-01T09:00:00' },
    ];

    const eventWithValidDates = new Event({
      id: 1,
      title: 'Team Meeting',
      userId: 123,
      dates: validDates,
    });

    expect(eventWithValidDates.dates).toEqual(validDates);
  });

  it('should reject invalid dates', () => {
    const invalidDates = [
      { start: 'invalid-date' },
      { start: '2023-10-01T09:00:00', end: 'invalid-date' },
      { start: '2023-10-01T11:00:00', end: '2023-10-01T10:00:00' },
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
        { start: '2023-10-01T09:00:00', end: '2023-10-01T10:00:00' },
        { start: '2023-10-01T11:00:00', end: '2023-10-01T13:00:00' },
      ],
    };

    const event = new Event(eventData);
    expect(event.totalHours).toEqual(3);
  });

  it('should update properties correctly', () => {
    const eventData = {
      id: 1,
      title: 'Team Meeting',
      userId: 123,
    };

    const event = new Event(eventData);

    const updatedData = {
      title: 'Updated Meeting',
      description: 'New agenda',
      dates: [{ start: '2023-10-01T09:00:00', end: '2023-10-01T10:00:00' }],
    };

    event.update(updatedData);

    expect(event.title).toEqual(updatedData.title);
    expect(event.description).toEqual(updatedData.description);
    expect(event.dates).toEqual(updatedData.dates);
    expect(event.totalHours).toEqual(1);
  });
});