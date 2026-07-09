import { ArrowCell } from '../interfaces/arrow-cell';
import { CellType } from '../interfaces/cell-type';
import { Direction } from '../interfaces/direction';

export class GridArrowCell implements ArrowCell {
  private readonly direction: Direction;

  private constructor(direction: Direction) {
    this.direction = direction;
  }

  static create(direction: Direction): GridArrowCell {
    return new GridArrowCell(direction);
  }

  getDirection(): Direction {
    return this.direction;
  }

  equals(other: CellType): boolean {
    return other instanceof GridArrowCell && this.direction.equals(other.direction);
  }
}
