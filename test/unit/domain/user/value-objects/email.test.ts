import { Email } from '../../../../../src/domain/user/value-objects/email';
import { InvalidEmailFormatError } from '../../../../../src/domain/user/errors';

describe('Email', () => {
  it('should_create_email_when_format_is_valid', () => {
    // Arrange
    const rawEmail = 'user@example.com';

    // Act
    const email = Email.create(rawEmail);

    // Assert
    expect(email.getValue()).toBe(rawEmail);
  });

  it('should_throw_invalid_email_format_error_when_missing_at_symbol', () => {
    // Arrange & Act & Assert
    expect(() => Email.create('user.example.com')).toThrow(InvalidEmailFormatError);
  });

  it('should_throw_invalid_email_format_error_when_missing_domain', () => {
    // Arrange & Act & Assert
    expect(() => Email.create('user@example')).toThrow(InvalidEmailFormatError);
  });

  it('should_be_equal_when_values_match', () => {
    // Arrange
    const first = Email.create('user@example.com');
    const second = Email.create('user@example.com');

    // Act & Assert
    expect(first.equals(second)).toBe(true);
  });
});
