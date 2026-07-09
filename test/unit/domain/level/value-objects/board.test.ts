import { Board } from '../../../../../src/domain/level/value-objects/board';
import { CellNode } from '../../../../../src/domain/level/value-objects/cell-node';
import { Edge } from '../../../../../src/domain/level/value-objects/edge';
import { NodeId } from '../../../../../src/domain/level/value-objects/node-id';
import { GridPosition } from '../../../../../src/domain/level/value-objects/grid-position';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';
import { ExitCell } from '../../../../../src/domain/level/value-objects/exit-cell';
import {
  DanglingEdgeError,
  EmptyBoardError,
  MissingExitCellError,
  MultipleExitCellsError,
} from '../../../../../src/domain/level/errors';

function buildNode(id: string, row: number, column: number, cellType: WallCell | ExitCell) {
  return CellNode.create(NodeId.create(id), GridPosition.create(row, column), cellType);
}

describe('Board', () => {
  it('should_create_when_nodes_are_not_empty_and_have_exactly_one_exit', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, WallCell.create()), buildNode('2', 0, 1, ExitCell.create())];
    const edges = [Edge.create(NodeId.create('1'), NodeId.create('2'))];

    // Act
    const board = Board.create(nodes, edges);

    // Assert
    expect(board.getNodes()).toHaveLength(2);
    expect(board.getEdges()).toHaveLength(1);
  });

  it('should_throw_empty_board_error_when_nodes_are_empty', () => {
    // Arrange & Act & Assert
    expect(() => Board.create([], [])).toThrow(EmptyBoardError);
  });

  it('should_throw_missing_exit_cell_error_when_no_node_is_an_exit', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, WallCell.create())];

    // Act & Assert
    expect(() => Board.create(nodes, [])).toThrow(MissingExitCellError);
  });

  it('should_throw_multiple_exit_cells_error_when_more_than_one_node_is_an_exit', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, ExitCell.create()), buildNode('2', 0, 1, ExitCell.create())];

    // Act & Assert
    expect(() => Board.create(nodes, [])).toThrow(MultipleExitCellsError);
  });

  it('should_throw_dangling_edge_error_when_an_edge_references_an_unknown_node', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, ExitCell.create())];
    const edges = [Edge.create(NodeId.create('1'), NodeId.create('2'))];

    // Act & Assert
    expect(() => Board.create(nodes, edges)).toThrow(DanglingEdgeError);
  });
});
