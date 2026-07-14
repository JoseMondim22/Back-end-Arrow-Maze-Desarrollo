import { InvalidGridDirectionError } from '../errors';
import { Direction } from '../interfaces/direction';

export type GridDirection3DValue = 'up' | 'right' | 'down' | 'left' | 'forward' | 'backward';

const VALID_VALUES: GridDirection3DValue[] = ['up', 'right', 'down', 'left', 'forward', 'backward'];

export class GridDirection3D implements Direction {
  private readonly value: GridDirection3DValue;

  private constructor(value: GridDirection3DValue) {
    this.value = value;
  }

  static create(value: string): GridDirection3D {
    const normalized = value.toLowerCase();
    if (!VALID_VALUES.includes(normalized as GridDirection3DValue)) {
      throw new InvalidGridDirectionError(`"${value}" is not a valid direction.`);
    }
    return new GridDirection3D(normalized as GridDirection3DValue);
  }

  getValue(): GridDirection3DValue {
    return this.value;
  }

  equals(other: Direction): boolean {
    return other instanceof GridDirection3D && this.value === other.value;
  }
}
