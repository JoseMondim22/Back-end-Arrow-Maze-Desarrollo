import { RegisterUserCommand } from '../../../src/application/commands/register-user.command';
import { EmailAlreadyRegisteredError, PasswordTooWeakError } from '../../../src/domain/user/errors';
import { RegisterUserTestAPI } from '../../testing-api/register-user.test-api';

describe('RegisterUserUseCase', () => {
  it('should_save_user_when_email_is_not_registered', async () => {
    // Arrange
    const api = new RegisterUserTestAPI();
    const command = new RegisterUserCommand('newuser@example.com', 'Password123', 'newuser');

    // Act
    await api.whenRegisteringUser(command);

    // Assert
    api.thenUserShouldBeSavedWithEmailAndUsername('newuser@example.com', 'newuser');
  });

  it('should_assign_generated_id_when_registering_user', async () => {
    // Arrange
    const api = new RegisterUserTestAPI();
    const command = new RegisterUserCommand('newuser@example.com', 'Password123', 'newuser');

    // Act
    await api.whenRegisteringUser(command);

    // Assert
    api.thenSavedUserShouldHaveGeneratedId();
  });

  it('should_save_hashed_password_when_registering_user', async () => {
    // Arrange
    const api = new RegisterUserTestAPI();
    const command = new RegisterUserCommand('newuser@example.com', 'Password123', 'newuser');

    // Act
    await api.whenRegisteringUser(command);

    // Assert
    api.thenSavedUserShouldHaveHashedPassword();
  });

  it('should_fail_when_email_is_already_registered', async () => {
    // Arrange
    const api = new RegisterUserTestAPI();
    api.givenExistingUserWithEmail('taken@example.com');
    const command = new RegisterUserCommand('taken@example.com', 'Password123', 'newuser');

    // Act
    await api.whenRegisteringUser(command);

    // Assert
    api.thenShouldFailWith(EmailAlreadyRegisteredError);
  });

  it('should_not_save_user_when_email_is_already_registered', async () => {
    // Arrange
    const api = new RegisterUserTestAPI();
    api.givenExistingUserWithEmail('taken@example.com');
    const command = new RegisterUserCommand('taken@example.com', 'Password123', 'newuser');

    // Act
    await api.whenRegisteringUser(command);

    // Assert
    api.thenNoUserShouldBeSaved();
  });

  it('should_fail_when_password_is_too_weak', async () => {
    // Arrange
    const api = new RegisterUserTestAPI();
    const command = new RegisterUserCommand('newuser@example.com', 'weak', 'newuser');

    // Act
    await api.whenRegisteringUser(command);

    // Assert
    api.thenShouldFailWith(PasswordTooWeakError);
  });
});
