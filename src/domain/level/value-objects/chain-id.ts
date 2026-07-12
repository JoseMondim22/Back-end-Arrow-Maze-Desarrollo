import { InvalidChainIdError } from '../errors';

const MAX_LENGTH = 12;

export class ChainId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ChainId {
    if (value.trim().length === 0 || value.length > MAX_LENGTH) {
      throw new InvalidChainIdError(
        `ChainId must be a non-empty string of at most ${MAX_LENGTH} characters.`,
      );
    }
    return new ChainId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ChainId): boolean {
    return this.value === other.value;
  }
}
