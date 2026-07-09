import { UserId } from './value-objects/user-id';
import { Email } from './value-objects/email';
import { Password } from './value-objects/password';
import { Username } from './value-objects/username';

export class User {
  private readonly id: UserId;
  private readonly email: Email;
  private readonly password: Password;
  private readonly username: Username;

  private constructor(id: UserId, email: Email, password: Password, username: Username) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.username = username;
  }

  static register(id: UserId, email: Email, password: Password, username: Username): User {
    return new User(id, email, password, username);
  }

  static reconstitute(id: UserId, email: Email, password: Password, username: Username): User {
    return new User(id, email, password, username);
  }

  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): Password {
    return this.password;
  }

  getUsername(): Username {
    return this.username;
  }
}
