import { InvalidGridPositionError, UnknownPositionTypeError } from '../errors';
import { Position } from '../interfaces/position';
import { GridPosition } from '../value-objects/grid-position';
import { GridPosition3D } from '../value-objects/grid-position-3d';

export interface PositionRawData {
  row: number;
  column: number;
  layer?: number;
  positionType?: string;
}

export class PositionFactory {
  static create(raw: PositionRawData): Position {
    switch (raw.positionType ?? 'grid') {
      case 'grid':
        return GridPosition.create(raw.row, raw.column);
      case 'grid3d':
        if (raw.layer === undefined) {
          throw new InvalidGridPositionError('layer is required for "grid3d" positions.');
        }
        return GridPosition3D.create(raw.row, raw.column, raw.layer);
      default:
        throw new UnknownPositionTypeError(`"${raw.positionType}" is not a known position type.`);
    }
  }
}
