import { Module } from '@nestjs/common';
import { ILevelRepository } from '../../domain/level/i-level-repository';
import { IProgressRepository } from '../../domain/progress/i-progress-repository';
import { IIdGenerator } from '../../application/ports/id-generator';
import { ILogger } from '../../application/ports/logger';
import { ITimeProvider } from '../../application/ports/time-provider';
import { SyncProgressCommand } from '../../application/commands/sync-progress.command';
import { SyncProgressUseCase } from '../../application/use-cases/sync-progress.use-case';
import { LoggingCommandDecorator } from '../../interface-adapters/decorators/command/logging-command.decorator';
import { SecureCommandDecorator } from '../../interface-adapters/decorators/command/secure-command.decorator';
import { ProgressController } from '../../interface-adapters/controllers/progress.controller';
import { SYNC_PROGRESS_SERVICE_FACTORY, SecureCommandServiceFactory } from '../../interface-adapters/controllers/tokens';
import { ID_GENERATOR, LEVEL_REPOSITORY, LOGGER, PROGRESS_REPOSITORY, TIME_PROVIDER } from '../tokens';
import { PersistenceModule } from './persistence.module';
import { SharedServicesModule } from './shared-services.module';
import { SecurityModule } from './security.module';

@Module({
  imports: [PersistenceModule, SharedServicesModule, SecurityModule],
  controllers: [ProgressController],
  providers: [
    {
      provide: SYNC_PROGRESS_SERVICE_FACTORY,
      useFactory: (
        levelRepository: ILevelRepository,
        progressRepository: IProgressRepository,
        idGenerator: IIdGenerator,
        logger: ILogger,
        timeProvider: ITimeProvider,
      ): SecureCommandServiceFactory<SyncProgressCommand> =>
        (currentUser) =>
          new SecureCommandDecorator(
            new LoggingCommandDecorator(
              new SyncProgressUseCase(levelRepository, progressRepository, idGenerator),
              logger,
              timeProvider,
            ),
            currentUser,
          ),
      inject: [LEVEL_REPOSITORY, PROGRESS_REPOSITORY, ID_GENERATOR, LOGGER, TIME_PROVIDER],
    },
  ],
})
export class ProgressModule {}
