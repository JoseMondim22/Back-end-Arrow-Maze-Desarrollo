import { UnknownCellTypeError } from '../errors';
import { CellType } from '../interfaces/cell-type';
import { EmptyCell } from '../value-objects/empty-cell';
import { ExitCell } from '../value-objects/exit-cell';
import { GridArrowCell } from '../value-objects/grid-arrow-cell';
import { GridDirection } from '../value-objects/grid-direction';
import { WallCell } from '../value-objects/wall-cell';

export interface CellRawData {
  type: string;
  direction?: string;
}

export class CellFactory {
  static create(rawData: CellRawData): CellType {
    switch (rawData.type) {
      case 'grid_arrow':
        return GridArrowCell.create(GridDirection.create(rawData.direction ?? ''));
      case 'wall':
        return WallCell.create();
      case 'empty':
        return EmptyCell.create();
      case 'exit':
        return ExitCell.create();
      default:
        throw new UnknownCellTypeError(`"${rawData.type}" is not a known cell type.`);
    }
  }
}
