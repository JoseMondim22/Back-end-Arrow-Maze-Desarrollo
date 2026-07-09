import { CellType } from '../interfaces/cell-type';

export class ExitCell implements CellType {
  private constructor() {}

  static create(): ExitCell {
    return new ExitCell();
  }

  equals(other: CellType): boolean {
    return other instanceof ExitCell;
  }
}
