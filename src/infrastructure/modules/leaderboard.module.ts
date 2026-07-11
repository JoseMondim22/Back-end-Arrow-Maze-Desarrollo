import { Module } from '@nestjs/common';
import { IProgressRepository } from '../../domain/progress/i-progress-repository';
import { IUserRepository } from '../../domain/user/i-user-repository';
import { ILogger } from '../../application/ports/logger';
import { ITimeProvider } from '../../application/ports/time-provider';
import { GetLeaderboardQuery } from '../../application/queries/get-leaderboard.query';
import { LeaderboardEntryResult } from '../../application/results/leaderboard-entry.result';
import { GetLeaderboardUseCase } from '../../application/use-cases/get-leaderboard.use-case';
import { LoggingQueryDecorator } from '../../interface-adapters/decorators/query/logging-query.decorator';
import { SecureQueryDecorator } from '../../interface-adapters/decorators/query/secure-query.decorator';
import { LeaderboardController } from '../../interface-adapters/controllers/leaderboard.controller';
import {
  GET_LEADERBOARD_SERVICE_FACTORY,
  SecureQueryServiceFactory,
} from '../../interface-adapters/controllers/tokens';
import { LOGGER, PROGRESS_REPOSITORY, TIME_PROVIDER, USER_REPOSITORY } from '../tokens';
import { PersistenceModule } from './persistence.module';
import { SharedServicesModule } from './shared-services.module';
import { SecurityModule } from './security.module';

@Module({
  imports: [PersistenceModule, SharedServicesModule, SecurityModule],
  controllers: [LeaderboardController],
  providers: [
    {
      provide: GET_LEADERBOARD_SERVICE_FACTORY,
      useFactory: (
        progressRepository: IProgressRepository,
        userRepository: IUserRepository,
        logger: ILogger,
        timeProvider: ITimeProvider,
      ): SecureQueryServiceFactory<GetLeaderboardQuery, LeaderboardEntryResult[]> =>
        (currentUser) =>
          new SecureQueryDecorator(
            new LoggingQueryDecorator(
              new GetLeaderboardUseCase(progressRepository, userRepository),
              logger,
              timeProvider,
            ),
            currentUser,
          ),
      inject: [PROGRESS_REPOSITORY, USER_REPOSITORY, LOGGER, TIME_PROVIDER],
    },
  ],
})
export class LeaderboardModule {}
