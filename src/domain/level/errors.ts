import { DomainError } from '../shared/domain-error';

export class InvalidLevelIdError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidNodeIdError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidLevelOrderError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidLevelRulesError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidGridPositionError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidGridDirectionError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class EmptyBoardError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MissingExitCellError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class MultipleExitCellsError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class DanglingEdgeError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownCellTypeError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
