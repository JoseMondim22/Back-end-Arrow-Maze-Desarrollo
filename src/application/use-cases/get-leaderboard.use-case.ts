import { IQueryService } from '../ports/query-service';
import { GetLeaderboardQuery } from '../queries/get-leaderboard.query';
import { LeaderboardEntryResult } from '../results/leaderboard-entry.result';
import { IProgressRepository } from '../../domain/progress/i-progress-repository';
import { IUserRepository } from '../../domain/user/i-user-repository';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { UserNotFoundError } from '../../domain/user/errors';

export class GetLeaderboardUseCase
  implements IQueryService<GetLeaderboardQuery, LeaderboardEntryResult[]>
{
  constructor(
    private readonly progressRepository: IProgressRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetLeaderboardQuery): Promise<LeaderboardEntryResult[]> {
    const levelId = LevelId.create(query.levelId);
    const topProgresses = await this.progressRepository.findTopScoresByLevel(levelId, query.limit);

    const entries: LeaderboardEntryResult[] = [];
    for (let index = 0; index < topProgresses.length; index++) {
      const progress = topProgresses[index];
      const user = await this.userRepository.findById(progress.getUserId());
      if (!user) {
        throw new UserNotFoundError(
          `User with id "${progress.getUserId().getValue()}" was not found.`,
        );
      }

      entries.push(
        new LeaderboardEntryResult(index + 1, user.getUsername().getValue(), progress.getBestScore().getValue()),
      );
    }

    return entries;
  }
}
