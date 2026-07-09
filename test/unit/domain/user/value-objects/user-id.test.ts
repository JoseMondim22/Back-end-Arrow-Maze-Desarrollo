import { UserId } from '../../../../../src/domain/user/value-objects/user-id';
import { InvalidUserIdError } from '../../../../../src/domain/user/errors';

describe('UserId', () => {
  it('should_create_when_value_is_numeric_and_up_to_12_chars', () => {
    // Arrange
    const rawId = '123456789012';

    // Act
    const userId = UserId.create(rawId);

    // Assert
    expect(userId.getValue()).toBe(rawId);
  });

  it('should_throw_invalid_user_id_error_when_value_is_empty', () => {
    // Arrange & Act & Assert
    expect(() => UserId.create('')).toThrow(InvalidUserIdError);
  });

  it('should_throw_invalid_user_id_error_when_value_is_not_numeric', () => {
    // Arrange & Act & Assert
    expect(() => UserId.create('11111111-1111')).toThrow(InvalidUserIdError);
  });

  it('should_throw_invalid_user_id_error_when_value_exceeds_12_chars', () => {
    // Arrange & Act & Assert
    expect(() => UserId.create('1234567890123')).toThrow(InvalidUserIdError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const rawId = '222222222222';
    const first = UserId.create(rawId);
    const second = UserId.create(rawId);

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
