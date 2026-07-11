import { Controller, Get, Headers, HttpCode, HttpStatus, Inject, Param, UseFilters } from '@nestjs/common';
import { GetLeaderboardQuery } from '../../application/queries/get-leaderboard.query';
import { LeaderboardEntryResult } from '../../application/results/leaderboard-entry.result';
import { LeaderboardEntryDTO } from '../dtos/output/leaderboard-entry.dto';
import { extractBearerToken } from './bearer-token.helper';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  CURRENT_USER_PROVIDER_FACTORY,
  CurrentUserProviderFactory,
  GET_LEADERBOARD_SERVICE_FACTORY,
  SecureQueryServiceFactory,
} from './tokens';

const LEADERBOARD_TOP_ENTRIES = 20;

@Controller('leaderboard')
@UseFilters(DomainExceptionFilter)
export class LeaderboardController {
  constructor(
    @Inject(CURRENT_USER_PROVIDER_FACTORY)
    private readonly currentUserProviderFactory: CurrentUserProviderFactory,
    @Inject(GET_LEADERBOARD_SERVICE_FACTORY)
    private readonly getLeaderboardServiceFactory: SecureQueryServiceFactory<
      GetLeaderboardQuery,
      LeaderboardEntryResult[]
    >,
  ) {}

  @Get(':levelId')
  @HttpCode(HttpStatus.OK)
  async getLeaderboard(
    @Param('levelId') levelId: string,
    @Headers('authorization') authorizationHeader?: string,
  ): Promise<LeaderboardEntryDTO[]> {
    const currentUser = this.currentUserProviderFactory(extractBearerToken(authorizationHeader));

    const entries = await this.getLeaderboardServiceFactory(currentUser).execute(
      new GetLeaderboardQuery(levelId, LEADERBOARD_TOP_ENTRIES),
    );

    return entries.map((entry) => new LeaderboardEntryDTO(entry.position, entry.username, entry.score));
  }
}
