import { InvalidUsernameError } from '../errors';

const MIN_LENGTH = 3;

export class Username {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Username {
    if (value.trim().length < MIN_LENGTH) {
      throw new InvalidUsernameError(`Username must be at least ${MIN_LENGTH} characters long.`);
    }
    return new Username(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }
}
