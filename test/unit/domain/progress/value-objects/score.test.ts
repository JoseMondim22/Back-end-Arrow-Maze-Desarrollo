import { Score } from '../../../../../src/domain/progress/value-objects/score';
import { InvalidScoreError } from '../../../../../src/domain/progress/errors';

describe('Score', () => {
  it('should_create_when_value_is_a_non_negative_integer', () => {
    // Arrange
    const rawScore = 80;

    // Act
    const score = Score.create(rawScore);

    // Assert
    expect(score.getValue()).toBe(rawScore);
  });

  it('should_throw_invalid_score_error_when_value_is_negative', () => {
    // Arrange & Act & Assert
    expect(() => Score.create(-1)).toThrow(InvalidScoreError);
  });

  it('should_throw_invalid_score_error_when_value_is_not_an_integer', () => {
    // Arrange & Act & Assert
    expect(() => Score.create(1.5)).toThrow(InvalidScoreError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const first = Score.create(50);
    const second = Score.create(50);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });

  it('should_be_higher_than_when_value_is_greater', () => {
    // Arrange
    const higher = Score.create(90);
    const lower = Score.create(80);

    // Act & Assert
    expect(higher.isHigherThan(lower)).toBe(true);
    expect(lower.isHigherThan(higher)).toBe(false);
  });
});
