import { BadRequestException } from '@nestjs/common';
import { IEventRepository } from '@domain/interfaces/IEventRepository';
import { EventCreateDto } from '@application/dto/events/event-create.dto';
import { CreateEventUseCase } from './CreateEvent';
import { RedisService } from '@infrastructure/services/redis.service';
import { Event } from '@domain/entities/event.entity';

// Utility type para crear mocks completos
type MockedService<T> = {
  [P in keyof T]: jest.Mock<any, any>;
};

describe('CreateEventUseCase', () => {
  let createEventUseCase: CreateEventUseCase;
  let mockEventRepository: MockedService<IEventRepository>;
  let mockRedisService: MockedService<RedisService>;

  const createValidEvent = (userId: number, dto: EventCreateDto): Event => {
    const event = new Event({
      userId,
      title: dto.title,
      type: dto.type,
      colleagues: dto.colleagues,
      description: dto.description,
      dates: dto.dates.map(d => ({
        day: d.day,
        hours: d.hours.map(h => ({ start: h.start, end: h.end }))
      }))
    });
    
    // Asignación directa para evitar dependencias del ORM
    Object.assign(event, {
      id: 1,
      totalHours: { hours: 6, minutes: 0 } // Valor calculado previamente
    });
    
    return event;
  };

  // Configuración común para los tests
  const validDto: EventCreateDto = {
    title: 'Planning Session',
    type: 'Workshop',
    colleagues: ['alice@example.com', 'bob@example.com'],
    dates: [
      {
        day: '2023-12-25',
        hours: [
          { start: '10:00', end: '12:00' },
          { start: '14:00', end: '16:00' },
        ],
      },
      {
        day: '2023-12-26',
        hours: [
          { start: '09:00', end: '11:00' },
        ],
      },
    ],
    description: 'Discuss project timelines and tasks',
  };

  // Mock completo para IEventRepository
  const createEventRepositoryMock = (): MockedService<IEventRepository> => ({
    create: jest.fn(),
    findById: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  // Mock completo para RedisService
  const createRedisServiceMock = (): MockedService<RedisService> => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    reset: jest.fn(),
  });

  beforeEach(() => {
    // Inicializar mocks completos
    mockEventRepository = createEventRepositoryMock();
    mockRedisService = createRedisServiceMock();
    
    // Configurar implementaciones por defecto
    mockRedisService.del.mockResolvedValue(undefined);
    
    createEventUseCase = new CreateEventUseCase(
      mockEventRepository as unknown as IEventRepository,
      mockRedisService as unknown as RedisService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an event and clear cache', async () => {
    // Arrange
    const userId = 42;
    const expectedEvent = createValidEvent(userId, validDto);
    mockEventRepository.create.mockResolvedValue(expectedEvent);

    // Act
    const result = await createEventUseCase.execute(validDto, userId);

    // Assert
    expect(mockEventRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRedisService.del).toHaveBeenCalledWith(`events_user_${userId}`);
    expect(result).toEqual(expectedEvent);
    
    // Verificar estructura del evento creado
    const createdEvent = mockEventRepository.create.mock.calls[0][0];
    expect(createdEvent).toBeInstanceOf(Event);
    expect(createdEvent.title).toBe(validDto.title);
    expect(createdEvent.totalHours.hours).toBe(6);
  });

  it('should throw error when repository fails', async () => {
    // Arrange
    const userId = 99;
    mockEventRepository.create.mockRejectedValue(new Error('Database Error'));

    // Act & Assert
    await expect(createEventUseCase.execute(validDto, userId))
      .rejects.toThrow(BadRequestException);
    
    expect(mockRedisService.del).not.toHaveBeenCalled();
  });

  it('should validate business rules before creation', async () => {
    // Arrange
    const invalidDto: EventCreateDto = {
      ...validDto,
      title: '', // Título inválido
    };

    // Act & Assert
    await expect(createEventUseCase.execute(invalidDto, 1))
      .rejects.toThrow('userId, title, and dates are required to create an Event.');
  });
});
