import { InvalidUserIdError } from '../errors';

const MAX_LENGTH = 12;
const NUMERIC_PATTERN = /^\d+$/;

export class UserId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): UserId {
    if (!NUMERIC_PATTERN.test(value) || value.length > MAX_LENGTH) {
      throw new InvalidUserIdError(
        `UserId must be numeric and at most ${MAX_LENGTH} characters long.`,
      );
    }
    return new UserId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
