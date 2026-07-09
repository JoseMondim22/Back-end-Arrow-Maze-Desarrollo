import { ProgressId } from '../../../../../src/domain/progress/value-objects/progress-id';
import { InvalidProgressIdError } from '../../../../../src/domain/progress/errors';

describe('ProgressId', () => {
  it('should_create_when_value_is_numeric_and_up_to_12_chars', () => {
    // Arrange
    const rawId = '123456789012';

    // Act
    const progressId = ProgressId.create(rawId);

    // Assert
    expect(progressId.getValue()).toBe(rawId);
  });

  it('should_throw_invalid_progress_id_error_when_value_is_empty', () => {
    // Arrange & Act & Assert
    expect(() => ProgressId.create('')).toThrow(InvalidProgressIdError);
  });

  it('should_throw_invalid_progress_id_error_when_value_is_not_numeric', () => {
    // Arrange & Act & Assert
    expect(() => ProgressId.create('11111111-1111')).toThrow(InvalidProgressIdError);
  });

  it('should_throw_invalid_progress_id_error_when_value_exceeds_12_chars', () => {
    // Arrange & Act & Assert
    expect(() => ProgressId.create('1234567890123')).toThrow(InvalidProgressIdError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const rawId = '222222222222';
    const first = ProgressId.create(rawId);
    const second = ProgressId.create(rawId);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
