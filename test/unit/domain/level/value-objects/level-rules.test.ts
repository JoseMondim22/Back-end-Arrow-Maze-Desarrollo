import { LevelRules } from '../../../../../src/domain/level/value-objects/level-rules';
import { InvalidLevelRulesError } from '../../../../../src/domain/level/errors';

describe('LevelRules', () => {
  it('should_create_when_all_fields_are_positive_integers', () => {
    // Arrange & Act
    const rules = LevelRules.create(60, 20, 100, 2);

    // Assert
    expect(rules.getTimeLimit()).toBe(60);
    expect(rules.getMaxMoves()).toBe(20);
    expect(rules.getMaxPossibleScore()).toBe(100);
    expect(rules.getDifficulty()).toBe(2);
  });

  it('should_throw_invalid_level_rules_error_when_time_limit_is_not_positive', () => {
    // Arrange & Act & Assert
    expect(() => LevelRules.create(0, 20, 100, 2)).toThrow(InvalidLevelRulesError);
  });

  it('should_throw_invalid_level_rules_error_when_max_moves_is_not_positive', () => {
    // Arrange & Act & Assert
    expect(() => LevelRules.create(60, 0, 100, 2)).toThrow(InvalidLevelRulesError);
  });

  it('should_throw_invalid_level_rules_error_when_max_possible_score_is_not_positive', () => {
    // Arrange & Act & Assert
    expect(() => LevelRules.create(60, 20, 0, 2)).toThrow(InvalidLevelRulesError);
  });

  it('should_throw_invalid_level_rules_error_when_difficulty_is_less_than_one', () => {
    // Arrange & Act & Assert
    expect(() => LevelRules.create(60, 20, 100, 0)).toThrow(InvalidLevelRulesError);
  });
});
