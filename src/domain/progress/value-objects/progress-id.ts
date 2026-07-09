import { InvalidProgressIdError } from '../errors';

const MAX_LENGTH = 12;
const NUMERIC_PATTERN = /^\d+$/;

export class ProgressId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ProgressId {
    if (!NUMERIC_PATTERN.test(value) || value.length > MAX_LENGTH) {
      throw new InvalidProgressIdError(
        `ProgressId must be numeric and at most ${MAX_LENGTH} characters long.`,
      );
    }
    return new ProgressId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProgressId): boolean {
    return this.value === other.value;
  }
}
