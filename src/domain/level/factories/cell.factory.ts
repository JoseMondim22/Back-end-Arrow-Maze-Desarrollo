import { UnknownCellTypeError, UnknownPositionTypeError } from '../errors';
import { CellType } from '../interfaces/cell-type';
import { EmptyCell } from '../value-objects/empty-cell';
import { ExitCell } from '../value-objects/exit-cell';
import { GridArrowCell } from '../value-objects/grid-arrow-cell';
import { GridDirection } from '../value-objects/grid-direction';
import { GridDirection3D } from '../value-objects/grid-direction-3d';
import { WallCell } from '../value-objects/wall-cell';

export interface CellRawData {
  type: string;
  direction?: string;
  positionType?: string;
}

export class CellFactory {
  static create(rawData: CellRawData): CellType {
    switch (rawData.type) {
      case 'grid_arrow':
        return GridArrowCell.create(CellFactory.createDirection(rawData));
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

  private static createDirection(rawData: CellRawData) {
    switch (rawData.positionType ?? 'grid') {
      case 'grid':
        return GridDirection.create(rawData.direction ?? '');
      case 'grid3d':
        return GridDirection3D.create(rawData.direction ?? '');
      default:
        throw new UnknownPositionTypeError(`"${rawData.positionType}" is not a known position type.`);
    }
  }
}
