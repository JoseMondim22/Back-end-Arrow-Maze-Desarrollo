import { Progress } from '../../../../src/domain/progress/progress.aggregate';
import { ProgressId } from '../../../../src/domain/progress/value-objects/progress-id';
import { Score } from '../../../../src/domain/progress/value-objects/score';
import { UserId } from '../../../../src/domain/user/value-objects/user-id';
import { LevelId } from '../../../../src/domain/level/value-objects/level-id';

describe('Progress', () => {
  it('should_keep_given_ids_and_score_when_created', () => {
    // Arrange
    const id = ProgressId.create('1');
    const userId = UserId.create('111111111111');
    const levelId = LevelId.create('1');
    const score = Score.create(80);

    // Act
    const progress = Progress.create(id, userId, levelId, score);

    // Assert
    expect(progress.getId().equals(id)).toBe(true);
    expect(progress.getUserId().equals(userId)).toBe(true);
    expect(progress.getLevelId().equals(levelId)).toBe(true);
    expect(progress.getBestScore().equals(score)).toBe(true);
  });

  it('should_keep_given_id_when_reconstituting_from_persistence', () => {
    // Arrange
    const id = ProgressId.create('2');
    const userId = UserId.create('222222222222');
    const levelId = LevelId.create('2');
    const score = Score.create(50);

    // Act
    const progress = Progress.reconstitute(id, userId, levelId, score);

    // Assert
    expect(progress.getId().equals(id)).toBe(true);
  });

  it('should_update_best_score_when_new_attempt_is_higher', () => {
    // Arrange
    const progress = Progress.create(
      ProgressId.create('1'),
      UserId.create('111111111111'),
      LevelId.create('1'),
      Score.create(50),
    );

    // Act
    progress.registerAttempt(Score.create(90));

    // Assert
    expect(progress.getBestScore().getValue()).toBe(90);
  });

  it('should_not_update_best_score_when_new_attempt_is_lower_or_equal', () => {
    // Arrange
    const progress = Progress.create(
      ProgressId.create('1'),
      UserId.create('111111111111'),
      LevelId.create('1'),
      Score.create(90),
    );

    // Act
    progress.registerAttempt(Score.create(50));

    // Assert
    expect(progress.getBestScore().getValue()).toBe(90);
  });
});
