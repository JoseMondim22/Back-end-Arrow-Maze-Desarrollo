import { LevelId } from '../../../../src/domain/level/value-objects/level-id';
import { Score } from '../../../../src/domain/progress/value-objects/score';
import { UserId } from '../../../../src/domain/user/value-objects/user-id';
import { ProgressMother } from '../../../mothers/progress.mother';

describe('Progress', () => {
  it('should_keep_given_ids_and_score_when_created', () => {
    // Arrange & Act
    const userId = UserId.create('111111111111');
    const levelId = LevelId.create('1');
    const progress = ProgressMother.withScore(userId, levelId, 80);

    // Assert
    expect(progress.getUserId().equals(userId)).toBe(true);
    expect(progress.getLevelId().equals(levelId)).toBe(true);
    expect(progress.getBestScore().getValue()).toBe(80);
  });

  it('should_keep_given_id_when_reconstituting_from_persistence', () => {
    // Arrange & Act
    const progress = ProgressMother.reconstitutedWithId('2');

    // Assert
    expect(progress.getId().getValue()).toBe('2');
  });

  it('should_update_best_score_when_new_attempt_is_higher', () => {
    // Arrange
    const progress = ProgressMother.withId('1');

    // Act
    progress.registerAttempt(Score.create(90));

    // Assert
    expect(progress.getBestScore().getValue()).toBe(90);
  });

  it('should_not_update_best_score_when_new_attempt_is_lower_or_equal', () => {
    // Arrange
    const progress = ProgressMother.withScore(
      UserId.create('111111111111'),
      LevelId.create('1'),
      90,
    );

    // Act
    progress.registerAttempt(Score.create(50));

    // Assert
    expect(progress.getBestScore().getValue()).toBe(90);
  });
});
