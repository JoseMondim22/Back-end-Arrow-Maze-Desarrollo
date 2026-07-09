import { Username } from '../../../../../src/domain/user/value-objects/username';
import { InvalidUsernameError } from '../../../../../src/domain/user/errors';

describe('Username', () => {
  it('should_create_username_when_at_least_3_chars', () => {
    // Arrange
    const rawUsername = 'joe';

    // Act
    const username = Username.create(rawUsername);

    // Assert
    expect(username.getValue()).toBe(rawUsername);
  });

  it('should_throw_invalid_username_error_when_shorter_than_3_chars', () => {
    // Arrange & Act & Assert
    expect(() => Username.create('jo')).toThrow(InvalidUsernameError);
  });

  it('should_throw_invalid_username_error_when_only_whitespace', () => {
    // Arrange & Act & Assert
    expect(() => Username.create('   ')).toThrow(InvalidUsernameError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const first = Username.create('joe');
    const second = Username.create('joe');

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
