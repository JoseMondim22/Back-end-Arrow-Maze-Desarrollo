import { CellType } from '../interfaces/cell-type';
import { NodeId } from './node-id';
import { Position } from '../interfaces/position';

export class CellNode {
  private readonly id: NodeId;
  private readonly position: Position;
  private readonly cellType: CellType;

  private constructor(id: NodeId, position: Position, cellType: CellType) {
    this.id = id;
    this.position = position;
    this.cellType = cellType;
  }

  static create(id: NodeId, position: Position, cellType: CellType): CellNode {
    return new CellNode(id, position, cellType);
  }

  getId(): NodeId {
    return this.id;
  }

  getPosition(): Position {
    return this.position;
  }

  getCellType(): CellType {
    return this.cellType;
  }
}
