import { SyncProgressUseCase } from '../../src/application/use-cases/sync-progress.use-case';
import { SyncProgressCommand } from '../../src/application/commands/sync-progress.command';
import { IIdGenerator } from '../../src/application/ports/id-generator';
import { InMemoryLevelRepository } from '../in-memory/in-memory-level.repository';
import { InMemoryProgressRepository } from '../in-memory/in-memory-progress.repository';
import { LevelMother } from '../mothers/level.mother';
import { ProgressMother } from '../mothers/progress.mother';
import { UserId } from '../../src/domain/user/value-objects/user-id';
import { LevelId } from '../../src/domain/level/value-objects/level-id';

const GENERATED_ID = '333333333333';

export class SyncProgressTestAPI {
  private readonly levelRepository = new InMemoryLevelRepository();
  private readonly progressRepository = new InMemoryProgressRepository();
  private readonly idGenerator: IIdGenerator = {
    generate: jest.fn().mockReturnValue(GENERATED_ID),
  };
  private thrownError: Error | null = null;

  givenLevelWithMaxScore(maxPossibleScore: number): void {
    this.levelRepository.seed(LevelMother.withMaxScore(maxPossibleScore));
  }

  givenNoExistingLevel(): void {
    // default state: repository starts empty
  }

  givenExistingProgress(userId: string, levelId: string, score: number): void {
    this.progressRepository.seed(
      ProgressMother.withScore(UserId.create(userId), LevelId.create(levelId), score),
    );
  }

  givenNoExistingProgress(): void {
    // default state: repository starts empty
  }

  async whenSyncingProgress(command: SyncProgressCommand): Promise<void> {
    const useCase = new SyncProgressUseCase(
      this.levelRepository,
      this.progressRepository,
      this.idGenerator,
    );

    try {
      await useCase.execute(command);
    } catch (error) {
      this.thrownError = error as Error;
    }
  }

  thenProgressShouldBeSavedWithBestScore(expectedScore: number): void {
    const savedProgress = this.progressRepository.getSavedProgresses()[0];
    expect(savedProgress).toBeDefined();
    expect(savedProgress.getBestScore().getValue()).toBe(expectedScore);
  }

  thenSavedProgressShouldHaveGeneratedId(): void {
    const savedProgress = this.progressRepository.getSavedProgresses()[0];
    expect(savedProgress.getId().getValue()).toBe(GENERATED_ID);
  }

  thenNoProgressShouldBeSaved(): void {
    expect(this.progressRepository.getSavedProgresses()).toHaveLength(0);
  }

  thenShouldFailWith(errorClass: new (...args: never[]) => Error): void {
    expect(this.thrownError).toBeInstanceOf(errorClass);
  }

  thenShouldFailWithMessage(message: string): void {
    expect(this.thrownError?.message).toBe(message);
  }
}
