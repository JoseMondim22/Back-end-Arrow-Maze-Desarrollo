import { InvalidGridPositionError } from '../errors';
import { Position } from '../interfaces/position';

export class GridPosition3D implements Position {
  private readonly row: number;
  private readonly column: number;
  private readonly layer: number;

  private constructor(row: number, column: number, layer: number) {
    this.row = row;
    this.column = column;
    this.layer = layer;
  }

  static create(row: number, column: number, layer: number): GridPosition3D {
    if (!Number.isInteger(row) || row < 0) {
      throw new InvalidGridPositionError('row must be a non-negative integer.');
    }
    if (!Number.isInteger(column) || column < 0) {
      throw new InvalidGridPositionError('column must be a non-negative integer.');
    }
    if (!Number.isInteger(layer) || layer < 0) {
      throw new InvalidGridPositionError('layer must be a non-negative integer.');
    }
    return new GridPosition3D(row, column, layer);
  }

  getRow(): number {
    return this.row;
  }

  getColumn(): number {
    return this.column;
  }

  getLayer(): number {
    return this.layer;
  }

  equals(other: Position): boolean {
    return (
      other instanceof GridPosition3D &&
      this.row === other.row &&
      this.column === other.column &&
      this.layer === other.layer
    );
  }
}
