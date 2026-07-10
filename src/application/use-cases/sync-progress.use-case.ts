import { ICommandService } from '../ports/command-service';
import { IIdGenerator } from '../ports/id-generator';
import { SyncProgressCommand } from '../commands/sync-progress.command';
import { ILevelRepository } from '../../domain/level/i-level-repository';
import { IProgressRepository } from '../../domain/progress/i-progress-repository';
import { LevelId } from '../../domain/level/value-objects/level-id';
import { LevelNotFoundError } from '../../domain/level/errors';
import { UserId } from '../../domain/user/value-objects/user-id';
import { Progress } from '../../domain/progress/progress.aggregate';
import { ProgressId } from '../../domain/progress/value-objects/progress-id';
import { Score } from '../../domain/progress/value-objects/score';
import { ImplausibleScoreError } from '../../domain/progress/errors';

export class SyncProgressUseCase implements ICommandService<SyncProgressCommand> {
  constructor(
    private readonly levelRepository: ILevelRepository,
    private readonly progressRepository: IProgressRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: SyncProgressCommand): Promise<void> {
    const levelId = LevelId.create(command.levelId);
    const level = await this.levelRepository.findById(levelId);
    if (!level) {
      throw new LevelNotFoundError(`Level with id "${command.levelId}" was not found.`);
    }

    if (!level.isScorePlausible(command.score)) {
      throw new ImplausibleScoreError(
        `Score ${command.score} exceeds the max possible score for level "${command.levelId}".`,
      );
    }

    const userId = UserId.create(command.userId);
    const score = Score.create(command.score);

    const existingProgress = await this.progressRepository.findByUserAndLevel(userId, levelId);
    if (existingProgress) {
      existingProgress.registerAttempt(score);
      await this.progressRepository.save(existingProgress);
      return;
    }

    const progress = Progress.create(
      ProgressId.create(this.idGenerator.generate()),
      userId,
      levelId,
      score,
    );
    await this.progressRepository.save(progress);
  }
}
