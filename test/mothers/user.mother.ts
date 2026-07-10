import { User } from '../../src/domain/user/user.aggregate';
import { Email } from '../../src/domain/user/value-objects/email';
import { Password } from '../../src/domain/user/value-objects/password';
import { UserId } from '../../src/domain/user/value-objects/user-id';
import { Username } from '../../src/domain/user/value-objects/username';

export class UserMother {
  static aUser(): User {
    return User.register(
      UserId.create('111111111111'),
      Email.create('user@example.com'),
      Password.fromHash('salt:hash'),
      Username.create('joe'),
    );
  }

  static withId(id: string): User {
    return User.register(
      UserId.create(id),
      Email.create('user@example.com'),
      Password.fromHash('salt:hash'),
      Username.create('joe'),
    );
  }

  static withEmail(email: string): User {
    return User.register(
      UserId.create('111111111111'),
      Email.create(email),
      Password.fromHash('salt:hash'),
      Username.create('joe'),
    );
  }

  static withUsername(username: string): User {
    return User.register(
      UserId.create('111111111111'),
      Email.create('user@example.com'),
      Password.fromHash('salt:hash'),
      Username.create(username),
    );
  }

  static withIdAndUsername(id: string, username: string): User {
    return User.register(
      UserId.create(id),
      Email.create('user@example.com'),
      Password.fromHash('salt:hash'),
      Username.create(username),
    );
  }

  static reconstitutedWithId(id: string): User {
    return User.reconstitute(
      UserId.create(id),
      Email.create('user@example.com'),
      Password.fromHash('salt:hash'),
      Username.create('joe'),
    );
  }
}
