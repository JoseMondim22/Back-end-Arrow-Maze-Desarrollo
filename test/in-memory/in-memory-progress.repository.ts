import { IProgressRepository } from '../../src/domain/progress/i-progress-repository';
import { Progress } from '../../src/domain/progress/progress.aggregate';
import { LevelId } from '../../src/domain/level/value-objects/level-id';
import { UserId } from '../../src/domain/user/value-objects/user-id';

export class InMemoryProgressRepository implements IProgressRepository {
  private readonly seededProgresses: Progress[] = [];
  private readonly savedProgresses: Progress[] = [];

  async findByUserAndLevel(userId: UserId, levelId: LevelId): Promise<Progress | null> {
    return (
      this.allProgresses().find(
        (progress) => progress.getUserId().equals(userId) && progress.getLevelId().equals(levelId),
      ) ?? null
    );
  }

  async findTopScoresByLevel(levelId: LevelId, limit: number): Promise<Progress[]> {
    return this.allProgresses()
      .filter((progress) => progress.getLevelId().equals(levelId))
      .sort((a, b) => b.getBestScore().getValue() - a.getBestScore().getValue())
      .slice(0, limit);
  }

  async save(progress: Progress): Promise<void> {
    this.savedProgresses.push(progress);
  }

  seed(progress: Progress): void {
    this.seededProgresses.push(progress);
  }

  getSavedProgresses(): Progress[] {
    return this.savedProgresses;
  }

  private allProgresses(): Progress[] {
    return [...this.seededProgresses, ...this.savedProgresses];
  }
}
