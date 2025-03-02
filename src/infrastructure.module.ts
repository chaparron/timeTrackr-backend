import { Event } from '@domain/entities/event.entity';
import { User } from '@domain/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeOrmRepository } from '@infrastructure/repositories/EnventTypeOrm.repository';
import { UserTypeOrmRepository } from '@infrastructure/repositories/UserTypeOrm.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@infrastructure/interceptors/logging.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User])],
  providers: [
    {
      provide: 'IEventRepository',
      useClass: EventTypeOrmRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
  exports: ['IEventRepository', 'IUserRepository'],
})
export class InfrastructureModule {}