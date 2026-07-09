import { CellType } from './cell-type';
import { Direction } from './direction';

export interface ArrowCell extends CellType {
  getDirection(): Direction;
}
