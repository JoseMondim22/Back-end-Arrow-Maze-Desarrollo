import { LoginQuery } from '../../../src/application/queries/login.query';
import { InvalidCredentialsError } from '../../../src/domain/user/errors';
import { LoginTestAPI } from '../../testing-api/login.test-api';

const EXISTING_USER_ID = '111111111111';

describe('LoginUseCase', () => {
  it('should_return_access_token_when_credentials_are_valid', async () => {
    // Arrange
    const api = new LoginTestAPI();
    api.givenExistingUserWithEmail('user@example.com');
    const query = new LoginQuery('user@example.com', 'Password123');

    // Act
    await api.whenLoggingIn(query);

    // Assert
    api.thenShouldReturnAccessToken();
  });

  it('should_return_authenticated_user_id_when_credentials_are_valid', async () => {
    // Arrange
    const api = new LoginTestAPI();
    api.givenExistingUserWithEmail('user@example.com');
    const query = new LoginQuery('user@example.com', 'Password123');

    // Act
    await api.whenLoggingIn(query);

    // Assert
    api.thenShouldReturnUserId(EXISTING_USER_ID);
  });

  it('should_generate_token_for_authenticated_user_when_credentials_are_valid', async () => {
    // Arrange
    const api = new LoginTestAPI();
    api.givenExistingUserWithEmail('user@example.com');
    const query = new LoginQuery('user@example.com', 'Password123');

    // Act
    await api.whenLoggingIn(query);

    // Assert
    api.thenTokenShouldBeGeneratedForUserId(EXISTING_USER_ID);
  });

  it('should_fail_when_email_is_not_registered', async () => {
    // Arrange
    const api = new LoginTestAPI();
    const query = new LoginQuery('unknown@example.com', 'Password123');

    // Act
    await api.whenLoggingIn(query);

    // Assert
    api.thenShouldFailWith(InvalidCredentialsError);
  });

  it('should_not_return_result_when_email_is_not_registered', async () => {
    // Arrange
    const api = new LoginTestAPI();
    const query = new LoginQuery('unknown@example.com', 'Password123');

    // Act
    await api.whenLoggingIn(query);

    // Assert
    api.thenNoResultShouldBeReturned();
  });

  it('should_fail_when_password_is_incorrect', async () => {
    // Arrange
    const api = new LoginTestAPI();
    api.givenExistingUserWithEmail('user@example.com');
    api.givenIncorrectPassword();
    const query = new LoginQuery('user@example.com', 'WrongPassword123');

    // Act
    await api.whenLoggingIn(query);

    // Assert
    api.thenShouldFailWith(InvalidCredentialsError);
  });
});
