import { DomainError } from '../shared/domain-error';

export class InvalidUserIdError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidEmailFormatError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class PasswordTooWeakError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidUsernameError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class EmailAlreadyRegisteredError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
