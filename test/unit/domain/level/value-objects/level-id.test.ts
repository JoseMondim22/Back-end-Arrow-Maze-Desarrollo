import { LevelId } from '../../../../../src/domain/level/value-objects/level-id';
import { InvalidLevelIdError } from '../../../../../src/domain/level/errors';

describe('LevelId', () => {
  it('should_create_when_value_is_numeric_and_up_to_12_chars', () => {
    // Arrange
    const rawId = '123456789012';

    // Act
    const levelId = LevelId.create(rawId);

    // Assert
    expect(levelId.getValue()).toBe(rawId);
  });

  it('should_throw_invalid_level_id_error_when_value_is_empty', () => {
    // Arrange & Act & Assert
    expect(() => LevelId.create('')).toThrow(InvalidLevelIdError);
  });

  it('should_throw_invalid_level_id_error_when_value_is_not_numeric', () => {
    // Arrange & Act & Assert
    expect(() => LevelId.create('11111111-1111')).toThrow(InvalidLevelIdError);
  });

  it('should_throw_invalid_level_id_error_when_value_exceeds_12_chars', () => {
    // Arrange & Act & Assert
    expect(() => LevelId.create('1234567890123')).toThrow(InvalidLevelIdError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const rawId = '222222222222';
    const first = LevelId.create(rawId);
    const second = LevelId.create(rawId);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
