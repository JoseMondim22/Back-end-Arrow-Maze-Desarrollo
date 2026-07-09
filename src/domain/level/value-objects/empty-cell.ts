import { CellType } from '../interfaces/cell-type';

export class EmptyCell implements CellType {
  private constructor() {}

  static create(): EmptyCell {
    return new EmptyCell();
  }

  equals(other: CellType): boolean {
    return other instanceof EmptyCell;
  }
}
