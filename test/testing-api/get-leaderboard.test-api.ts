import { GetLeaderboardUseCase } from '../../src/application/use-cases/get-leaderboard.use-case';
import { GetLeaderboardQuery } from '../../src/application/queries/get-leaderboard.query';
import { LeaderboardEntryResult } from '../../src/application/results/leaderboard-entry.result';
import { InMemoryProgressRepository } from '../in-memory/in-memory-progress.repository';
import { InMemoryUserRepository } from '../in-memory/in-memory-user.repository';
import { UserMother } from '../mothers/user.mother';
import { ProgressMother } from '../mothers/progress.mother';
import { UserId } from '../../src/domain/user/value-objects/user-id';
import { LevelId } from '../../src/domain/level/value-objects/level-id';

const LEVEL_ID = '1';

export class GetLeaderboardTestAPI {
  private readonly progressRepository = new InMemoryProgressRepository();
  private readonly userRepository = new InMemoryUserRepository();
  private result: LeaderboardEntryResult[] = [];
  private thrownError: Error | null = null;

  givenUserWithProgress(userId: string, username: string, score: number): void {
    this.userRepository.seed(UserMother.withIdAndUsername(userId, username));
    this.progressRepository.seed(
      ProgressMother.withScore(UserId.create(userId), LevelId.create(LEVEL_ID), score),
    );
  }

  givenProgressWithoutMatchingUser(userId: string, score: number): void {
    this.progressRepository.seed(
      ProgressMother.withScore(UserId.create(userId), LevelId.create(LEVEL_ID), score),
    );
  }

  givenNoExistingProgress(): void {
    // default state: repository starts empty
  }

  async whenGettingLeaderboard(limit: number): Promise<void> {
    const useCase = new GetLeaderboardUseCase(this.progressRepository, this.userRepository);

    try {
      this.result = await useCase.execute(new GetLeaderboardQuery(LEVEL_ID, limit));
    } catch (error) {
      this.thrownError = error as Error;
    }
  }

  thenShouldReturnEntryCount(expectedCount: number): void {
    expect(this.result).toHaveLength(expectedCount);
  }

  thenEntryAtPositionShouldHave(position: number, username: string, score: number): void {
    const entry = this.result.find((e) => e.position === position);
    expect(entry).toBeDefined();
    expect(entry!.username).toBe(username);
    expect(entry!.score).toBe(score);
  }

  thenShouldFailWith(errorClass: new (...args: never[]) => Error): void {
    expect(this.thrownError).toBeInstanceOf(errorClass);
  }
}
