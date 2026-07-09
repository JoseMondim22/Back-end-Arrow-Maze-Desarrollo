import { InvalidScoreError } from '../errors';

export class Score {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): Score {
    if (!Number.isInteger(value) || value < 0) {
      throw new InvalidScoreError('Score must be a non-negative integer.');
    }
    return new Score(value);
  }

  getValue(): number {
    return this.value;
  }

  isHigherThan(other: Score): boolean {
    return this.value > other.value;
  }

  equals(other: Score): boolean {
    return this.value === other.value;
  }
}
