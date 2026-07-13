import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Inject, Post, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Progress } from '../../domain/progress/progress.aggregate';
import { SyncProgressCommand } from '../../application/commands/sync-progress.command';
import { GetPlayerProgressQuery } from '../../application/queries/get-player-progress.query';
import { SyncDTO } from '../dtos/input/sync.dto';
import { PlayerProgressEntryDTO } from '../dtos/output/player-progress-entry.dto';
import { extractBearerToken } from './bearer-token.helper';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  CURRENT_USER_PROVIDER_FACTORY,
  CurrentUserProviderFactory,
  GET_PLAYER_PROGRESS_SERVICE_FACTORY,
  SYNC_PROGRESS_SERVICE_FACTORY,
  SecureCommandServiceFactory,
  SecureQueryServiceFactory,
} from './tokens';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
@UseFilters(DomainExceptionFilter)
export class ProgressController {
  constructor(
    @Inject(CURRENT_USER_PROVIDER_FACTORY)
    private readonly currentUserProviderFactory: CurrentUserProviderFactory,
    @Inject(SYNC_PROGRESS_SERVICE_FACTORY)
    private readonly syncProgressServiceFactory: SecureCommandServiceFactory<SyncProgressCommand>,
    @Inject(GET_PLAYER_PROGRESS_SERVICE_FACTORY)
    private readonly getPlayerProgressServiceFactory: SecureQueryServiceFactory<
      GetPlayerProgressQuery,
      Progress[]
    >,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get the current user's progress across all levels" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player progress retrieved successfully',
    type: [PlayerProgressEntryDTO],
  })
  async getPlayerProgress(
    @Headers('authorization') authorizationHeader?: string,
  ): Promise<PlayerProgressEntryDTO[]> {
    const currentUser = this.currentUserProviderFactory(extractBearerToken(authorizationHeader));
    const userId = currentUser.getUserId();

    const progressEntries = await this.getPlayerProgressServiceFactory(currentUser).execute(
      new GetPlayerProgressQuery(userId),
    );

    return progressEntries.map(
      (progress) => new PlayerProgressEntryDTO(progress.getLevelId().getValue(), progress.getBestScore().getValue()),
    );
  }

  @Post('sync')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sync a level attempt score for the current user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Progress synced successfully' })
  async sync(
    @Body() dto: SyncDTO,
    @Headers('authorization') authorizationHeader?: string,
  ): Promise<void> {
    const currentUser = this.currentUserProviderFactory(extractBearerToken(authorizationHeader));

    // getUserId() triggers the ONE verify() call for this request (memoized inside
    // CurrentUserProvider). The SecureCommandDecorator below reuses that same
    // instance, so it hits the cache instead of verifying the token a second time.
    const userId = currentUser.getUserId();

    await this.syncProgressServiceFactory(currentUser).execute(
      new SyncProgressCommand(userId, dto.levelId, dto.score),
    );
  }
}
