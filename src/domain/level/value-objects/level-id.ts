import { InvalidLevelIdError } from '../errors';

const MAX_LENGTH = 12;
const NUMERIC_PATTERN = /^\d+$/;

export class LevelId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): LevelId {
    if (!NUMERIC_PATTERN.test(value) || value.length > MAX_LENGTH) {
      throw new InvalidLevelIdError(
        `LevelId must be numeric and at most ${MAX_LENGTH} characters long.`,
      );
    }
    return new LevelId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: LevelId): boolean {
    return this.value === other.value;
  }
}
