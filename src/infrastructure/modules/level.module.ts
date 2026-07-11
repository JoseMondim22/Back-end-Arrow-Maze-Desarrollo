import { Module } from '@nestjs/common';
import { ILevelRepository } from '../../domain/level/i-level-repository';
import { Level } from '../../domain/level/level.aggregate';
import { IIdGenerator } from '../../application/ports/id-generator';
import { ILogger } from '../../application/ports/logger';
import { ITimeProvider } from '../../application/ports/time-provider';
import { GetLevelsQuery } from '../../application/queries/get-levels.query';
import { CreateLevelCommand } from '../../application/commands/create-level.command';
import { GetLevelsUseCase } from '../../application/use-cases/get-levels.use-case';
import { CreateLevelUseCase } from '../../application/use-cases/create-level.use-case';
import { LoggingCommandDecorator } from '../../interface-adapters/decorators/command/logging-command.decorator';
import { LoggingQueryDecorator } from '../../interface-adapters/decorators/query/logging-query.decorator';
import { SecureCommandDecorator } from '../../interface-adapters/decorators/command/secure-command.decorator';
import { SecureQueryDecorator } from '../../interface-adapters/decorators/query/secure-query.decorator';
import { LevelController } from '../../interface-adapters/controllers/level.controller';
import {
  CREATE_LEVEL_SERVICE_FACTORY,
  GET_LEVELS_SERVICE_FACTORY,
  SecureCommandServiceFactory,
  SecureQueryServiceFactory,
} from '../../interface-adapters/controllers/tokens';
import { ID_GENERATOR, LEVEL_REPOSITORY, LOGGER, TIME_PROVIDER } from '../tokens';
import { PersistenceModule } from './persistence.module';
import { SharedServicesModule } from './shared-services.module';
import { SecurityModule } from './security.module';

@Module({
  imports: [PersistenceModule, SharedServicesModule, SecurityModule],
  controllers: [LevelController],
  providers: [
    {
      provide: GET_LEVELS_SERVICE_FACTORY,
      useFactory: (
        levelRepository: ILevelRepository,
        logger: ILogger,
        timeProvider: ITimeProvider,
      ): SecureQueryServiceFactory<GetLevelsQuery, Level[]> =>
        (currentUser) =>
          new SecureQueryDecorator(
            new LoggingQueryDecorator(new GetLevelsUseCase(levelRepository), logger, timeProvider),
            currentUser,
          ),
      inject: [LEVEL_REPOSITORY, LOGGER, TIME_PROVIDER],
    },
    {
      provide: CREATE_LEVEL_SERVICE_FACTORY,
      useFactory: (
        levelRepository: ILevelRepository,
        idGenerator: IIdGenerator,
        logger: ILogger,
        timeProvider: ITimeProvider,
      ): SecureCommandServiceFactory<CreateLevelCommand> =>
        (currentUser) =>
          new SecureCommandDecorator(
            new LoggingCommandDecorator(
              new CreateLevelUseCase(levelRepository, idGenerator),
              logger,
              timeProvider,
            ),
            currentUser,
          ),
      inject: [LEVEL_REPOSITORY, ID_GENERATOR, LOGGER, TIME_PROVIDER],
    },
  ],
})
export class LevelModule {}
