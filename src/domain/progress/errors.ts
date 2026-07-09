import { DomainError } from '../shared/domain-error';

export class InvalidProgressIdError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidScoreError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
