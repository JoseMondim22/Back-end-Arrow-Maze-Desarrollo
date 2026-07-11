import { Body, Controller, Headers, HttpCode, HttpStatus, Inject, Post, UseFilters } from '@nestjs/common';
import { SyncProgressCommand } from '../../application/commands/sync-progress.command';
import { SyncDTO } from '../dtos/input/sync.dto';
import { extractBearerToken } from './bearer-token.helper';
import { DomainExceptionFilter } from './domain-exception.filter';
import {
  CURRENT_USER_PROVIDER_FACTORY,
  CurrentUserProviderFactory,
  SYNC_PROGRESS_SERVICE_FACTORY,
  SecureCommandServiceFactory,
} from './tokens';

@Controller('progress')
@UseFilters(DomainExceptionFilter)
export class ProgressController {
  constructor(
    @Inject(CURRENT_USER_PROVIDER_FACTORY)
    private readonly currentUserProviderFactory: CurrentUserProviderFactory,
    @Inject(SYNC_PROGRESS_SERVICE_FACTORY)
    private readonly syncProgressServiceFactory: SecureCommandServiceFactory<SyncProgressCommand>,
  ) {}

  @Post('sync')
  @HttpCode(HttpStatus.NO_CONTENT)
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
