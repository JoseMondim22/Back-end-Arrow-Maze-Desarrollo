import { Password } from '../../../../../src/domain/user/value-objects/password';
import { PasswordTooWeakError } from '../../../../../src/domain/user/errors';

describe('Password', () => {
  it('should_not_throw_when_at_least_8_alphanumeric_chars', () => {
    // Arrange
    const plainText = 'abc12345';

    // Act & Assert
    expect(() => Password.ensureIsStrong(plainText)).not.toThrow();
  });

  it('should_throw_password_too_weak_error_when_shorter_than_8_chars', () => {
    // Arrange & Act & Assert
    expect(() => Password.ensureIsStrong('abc123')).toThrow(PasswordTooWeakError);
  });

  it('should_throw_password_too_weak_error_when_missing_digit', () => {
    // Arrange & Act & Assert
    expect(() => Password.ensureIsStrong('abcdefgh')).toThrow(PasswordTooWeakError);
  });

  it('should_throw_password_too_weak_error_when_missing_letter', () => {
    // Arrange & Act & Assert
    expect(() => Password.ensureIsStrong('12345678')).toThrow(PasswordTooWeakError);
  });

  it('should_reconstitute_from_stored_hash_when_loading_existing_user', () => {
    // Arrange
    const hash = 'salt:derivedKeyComputedByTheUseCase';

    // Act
    const password = Password.fromHash(hash);

    // Assert
    expect(password.getHash()).toBe(hash);
  });
});
