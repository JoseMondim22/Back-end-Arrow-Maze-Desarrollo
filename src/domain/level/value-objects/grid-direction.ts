import { InvalidGridDirectionError } from '../errors';
import { Direction } from '../interfaces/direction';

export type GridDirectionValue = 'up' | 'right' | 'down' | 'left';

const VALID_VALUES: GridDirectionValue[] = ['up', 'right', 'down', 'left'];

export class GridDirection implements Direction {
  private readonly value: GridDirectionValue;

  private constructor(value: GridDirectionValue) {
    this.value = value;
  }

  static create(value: string): GridDirection {
    const normalized = value.toLowerCase();
    if (!VALID_VALUES.includes(normalized as GridDirectionValue)) {
      throw new InvalidGridDirectionError(`"${value}" is not a valid direction.`);
    }
    return new GridDirection(normalized as GridDirectionValue);
  }

  getValue(): GridDirectionValue {
    return this.value;
  }

  equals(other: Direction): boolean {
    return other instanceof GridDirection && this.value === other.value;
  }
}
