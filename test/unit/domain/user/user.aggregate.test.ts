import { User } from '../../../../src/domain/user/user.aggregate';
import { Email } from '../../../../src/domain/user/value-objects/email';
import { Password } from '../../../../src/domain/user/value-objects/password';
import { Username } from '../../../../src/domain/user/value-objects/username';
import { UserId } from '../../../../src/domain/user/value-objects/user-id';

describe('User', () => {
  it('should_keep_given_id_when_registering', () => {
    // Arrange
    const id = UserId.create('111111111111');
    const email = Email.create('user@example.com');
    const password = Password.fromHash('salt:hash');
    const username = Username.create('joe');

    // Act
    const user = User.register(id, email, password, username);

    // Assert
    expect(user.getId().equals(id)).toBe(true);
    expect(user.getEmail().equals(email)).toBe(true);
    expect(user.getUsername().equals(username)).toBe(true);
  });

  it('should_keep_given_id_when_reconstituting_from_persistence', () => {
    // Arrange
    const existingId = UserId.create('333333333333');
    const email = Email.create('user@example.com');
    const password = Password.fromHash('salt:hash');
    const username = Username.create('joe');

    // Act
    const user = User.reconstitute(existingId, email, password, username);

    // Assert
    expect(user.getId().equals(existingId)).toBe(true);
  });
});
