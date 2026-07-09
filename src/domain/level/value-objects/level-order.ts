import { InvalidLevelOrderError } from '../errors';

const MIN_VALUE = 1;

export class LevelOrder {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): LevelOrder {
    if (!Number.isInteger(value) || value < MIN_VALUE) {
      throw new InvalidLevelOrderError(`LevelOrder must be an integer starting at ${MIN_VALUE}.`);
    }
    return new LevelOrder(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: LevelOrder): boolean {
    return this.value === other.value;
  }
}
