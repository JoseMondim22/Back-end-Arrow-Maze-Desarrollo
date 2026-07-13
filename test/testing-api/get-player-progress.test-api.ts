import { GetPlayerProgressUseCase } from '../../src/application/use-cases/get-player-progress.use-case';
import { GetPlayerProgressQuery } from '../../src/application/queries/get-player-progress.query';
import { Progress } from '../../src/domain/progress/progress.aggregate';
import { InMemoryProgressRepository } from '../in-memory/in-memory-progress.repository';
import { ProgressMother } from '../mothers/progress.mother';
import { UserId } from '../../src/domain/user/value-objects/user-id';
import { LevelId } from '../../src/domain/level/value-objects/level-id';

export class GetPlayerProgressTestAPI {
  private readonly progressRepository = new InMemoryProgressRepository();
  private result: Progress[] = [];

  givenProgressForUser(userId: string, levelId: string, score: number): void {
    this.progressRepository.seed(
      ProgressMother.withScore(UserId.create(userId), LevelId.create(levelId), score),
    );
  }

  givenNoExistingProgress(): void {
    // default state: repository starts empty
  }

  async whenGettingPlayerProgress(userId: string): Promise<void> {
    const useCase = new GetPlayerProgressUseCase(this.progressRepository);
    this.result = await useCase.execute(new GetPlayerProgressQuery(userId));
  }

  thenShouldReturnEntryCount(expectedCount: number): void {
    expect(this.result).toHaveLength(expectedCount);
  }

  thenShouldContainLevelWithScore(levelId: string, score: number): void {
    const entry = this.result.find((progress) => progress.getLevelId().getValue() === levelId);
    expect(entry).toBeDefined();
    expect(entry!.getBestScore().getValue()).toBe(score);
  }
}
