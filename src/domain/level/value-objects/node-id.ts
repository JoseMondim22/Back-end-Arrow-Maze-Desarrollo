import { InvalidNodeIdError } from '../errors';

const MAX_LENGTH = 12;
const NUMERIC_PATTERN = /^\d+$/;

export class NodeId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): NodeId {
    if (!NUMERIC_PATTERN.test(value) || value.length > MAX_LENGTH) {
      throw new InvalidNodeIdError(
        `NodeId must be numeric and at most ${MAX_LENGTH} characters long.`,
      );
    }
    return new NodeId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: NodeId): boolean {
    return this.value === other.value;
  }
}
