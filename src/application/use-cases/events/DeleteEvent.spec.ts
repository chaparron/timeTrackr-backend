import { IEventRepository } from '@domain/interfaces/IEventRepository';
import { RedisService } from '@infrastructure/services/redis.service';
import { Event } from '@domain/entities/event.entity';
import { DeleteEventUseCase } from './DeleteEvent';

describe('DeleteEventUseCase', () => {
  let deleteEventUseCase: DeleteEventUseCase;
  
  const mockEventRepository: jest.Mocked<IEventRepository> = {
    findById: jest.fn(),
    delete: jest.fn(),
  } as any;

  const mockRedisService: jest.Mocked<RedisService> = {
    del: jest.fn(),
  } as any;

  const createTestEvent = (userId: number): Event => {
    const event = new Event({
      userId,
      title: 'Test Event',
      dates: [{
        day: '2023-01-01',
        hours: [{ start: '10:00', end: '12:00' }]
      }],
    });
    
    Object.assign(event, {
      id: 1,
      totalHours: { hours: 2, minutes: 0 }
    });
    
    return event;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    deleteEventUseCase = new DeleteEventUseCase(
      mockEventRepository,
      mockRedisService
    );
  });

  describe('execute', () => {
    it('should delete event and clear cache successfully', async () => {
      const testEvent = createTestEvent(1);
      mockEventRepository.findById.mockResolvedValue(testEvent);

      await deleteEventUseCase.execute(1, 1);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRedisService.del).toHaveBeenNthCalledWith(1, 'events_user_1');
      expect(mockRedisService.del).toHaveBeenNthCalledWith(2, 'event_1');
      expect(mockEventRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error when user is not authorized', async () => {
      const testEvent = createTestEvent(2);
      mockEventRepository.findById.mockResolvedValue(testEvent);

      await expect(deleteEventUseCase.execute(1, 1))
        .rejects.toThrow('Unauthorized');
    });
  });
});