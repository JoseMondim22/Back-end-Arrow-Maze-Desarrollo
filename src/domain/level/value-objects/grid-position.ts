import { InvalidGridPositionError } from '../errors';
import { Position } from '../interfaces/position';

export class GridPosition implements Position {
  private readonly row: number;
  private readonly column: number;

  private constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  static create(row: number, column: number): GridPosition {
    if (!Number.isInteger(row) || row < 0) {
      throw new InvalidGridPositionError('row must be a non-negative integer.');
    }
    if (!Number.isInteger(column) || column < 0) {
      throw new InvalidGridPositionError('column must be a non-negative integer.');
    }
    return new GridPosition(row, column);
  }

  getRow(): number {
    return this.row;
  }

  getColumn(): number {
    return this.column;
  }

  equals(other: Position): boolean {
    return other instanceof GridPosition && this.row === other.row && this.column === other.column;
  }
}
