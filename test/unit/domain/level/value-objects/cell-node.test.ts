import { CellNode } from '../../../../../src/domain/level/value-objects/cell-node';
import { NodeId } from '../../../../../src/domain/level/value-objects/node-id';
import { GridPosition } from '../../../../../src/domain/level/value-objects/grid-position';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';

describe('CellNode', () => {
  it('should_keep_given_id_position_and_cell_type_when_created', () => {
    // Arrange
    const id = NodeId.create('1');
    const position = GridPosition.create(0, 1);
    const cellType = WallCell.create();

    // Act
    const node = CellNode.create(id, position, cellType);

    // Assert
    expect(node.getId().equals(id)).toBe(true);
    expect(node.getPosition().equals(position)).toBe(true);
    expect(node.getCellType().equals(cellType)).toBe(true);
  });
});
