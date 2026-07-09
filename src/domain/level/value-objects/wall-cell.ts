import { CellType } from '../interfaces/cell-type';

export class WallCell implements CellType {
  private constructor() {}

  static create(): WallCell {
    return new WallCell();
  }

  equals(other: CellType): boolean {
    return other instanceof WallCell;
  }
}
