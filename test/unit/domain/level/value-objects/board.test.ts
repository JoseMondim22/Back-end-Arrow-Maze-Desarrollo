import { Board } from '../../../../../src/domain/level/value-objects/board';
import { CellNode } from '../../../../../src/domain/level/value-objects/cell-node';
import { Chain } from '../../../../../src/domain/level/value-objects/chain';
import { ChainId } from '../../../../../src/domain/level/value-objects/chain-id';
import { Edge } from '../../../../../src/domain/level/value-objects/edge';
import { NodeId } from '../../../../../src/domain/level/value-objects/node-id';
import { GridPosition } from '../../../../../src/domain/level/value-objects/grid-position';
import { GridArrowCell } from '../../../../../src/domain/level/value-objects/grid-arrow-cell';
import { GridDirection } from '../../../../../src/domain/level/value-objects/grid-direction';
import { EmptyCell } from '../../../../../src/domain/level/value-objects/empty-cell';
import { WallCell } from '../../../../../src/domain/level/value-objects/wall-cell';
import { ExitCell } from '../../../../../src/domain/level/value-objects/exit-cell';
import { CellType } from '../../../../../src/domain/level/interfaces/cell-type';
import {
  DanglingChainError,
  DanglingEdgeError,
  DuplicateChainNodeError,
  EmptyBoardError,
  EmptyChainError,
  InvalidChainBodyError,
  InvalidChainHeadError,
  MissingExitCellError,
} from '../../../../../src/domain/level/errors';

function buildNode(id: string, row: number, column: number, cellType: CellType) {
  return CellNode.create(NodeId.create(id), GridPosition.create(row, column), cellType);
}

function anArrowCell() {
  return GridArrowCell.create(GridDirection.create('up'));
}

function aChain(id: string, nodeIds: string[]) {
  return Chain.create(ChainId.create(id), nodeIds.map((nodeId) => NodeId.create(nodeId)));
}

describe('Board', () => {
  it('should_create_when_nodes_are_not_empty_and_have_exactly_one_exit', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, WallCell.create()), buildNode('2', 0, 1, ExitCell.create())];
    const edges = [Edge.create(NodeId.create('1'), NodeId.create('2'))];

    // Act
    const board = Board.create(nodes, edges, []);

    // Assert
    expect(board.getNodes()).toHaveLength(2);
    expect(board.getEdges()).toHaveLength(1);
  });

  it('should_throw_empty_board_error_when_nodes_are_empty', () => {
    // Arrange & Act & Assert
    expect(() => Board.create([], [], [])).toThrow(EmptyBoardError);
  });

  it('should_throw_missing_exit_cell_error_when_no_node_is_an_exit', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, WallCell.create())];

    // Act & Assert
    expect(() => Board.create(nodes, [], [])).toThrow(MissingExitCellError);
  });

  it('should_create_when_board_has_more_than_one_exit', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, ExitCell.create()), buildNode('2', 0, 1, ExitCell.create())];

    // Act
    const board = Board.create(nodes, [], []);

    // Assert
    expect(board.getNodes()).toHaveLength(2);
  });

  it('should_throw_dangling_edge_error_when_an_edge_references_an_unknown_node', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, ExitCell.create())];
    const edges = [Edge.create(NodeId.create('1'), NodeId.create('2'))];

    // Act & Assert
    expect(() => Board.create(nodes, edges, [])).toThrow(DanglingEdgeError);
  });

  it('should_build_board_when_chain_is_valid', () => {
    // Arrange
    const nodes = [
      buildNode('1', 0, 0, EmptyCell.create()),
      buildNode('2', 0, 1, anArrowCell()),
      buildNode('3', 0, 2, ExitCell.create()),
    ];

    // Act
    const board = Board.create(nodes, [], [aChain('c1', ['1', '2'])]);

    // Assert
    expect(board.getChains()).toHaveLength(1);
  });

  it('should_fail_when_chain_node_id_is_unknown', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, anArrowCell()), buildNode('2', 0, 1, ExitCell.create())];

    // Act & Assert
    expect(() => Board.create(nodes, [], [aChain('c1', ['9', '1'])])).toThrow(DanglingChainError);
  });

  it('should_fail_when_chain_is_empty', () => {
    // Arrange
    const nodes = [buildNode('1', 0, 0, ExitCell.create())];

    // Act & Assert
    expect(() => Board.create(nodes, [], [aChain('c1', [])])).toThrow(EmptyChainError);
  });

  it('should_fail_when_chain_has_duplicate_nodes', () => {
    // Arrange
    const nodes = [
      buildNode('1', 0, 0, EmptyCell.create()),
      buildNode('2', 0, 1, anArrowCell()),
      buildNode('3', 0, 2, ExitCell.create()),
    ];

    // Act & Assert
    expect(() => Board.create(nodes, [], [aChain('c1', ['1', '1', '2'])])).toThrow(DuplicateChainNodeError);
  });

  it('should_fail_when_chain_head_is_not_an_arrow', () => {
    // Arrange
    const nodes = [
      buildNode('1', 0, 0, EmptyCell.create()),
      buildNode('2', 0, 1, EmptyCell.create()),
      buildNode('3', 0, 2, ExitCell.create()),
    ];

    // Act & Assert
    expect(() => Board.create(nodes, [], [aChain('c1', ['1', '2'])])).toThrow(InvalidChainHeadError);
  });

  it('should_fail_when_chain_body_is_not_empty', () => {
    // Arrange
    const nodes = [
      buildNode('1', 0, 0, WallCell.create()),
      buildNode('2', 0, 1, anArrowCell()),
      buildNode('3', 0, 2, ExitCell.create()),
    ];

    // Act & Assert
    expect(() => Board.create(nodes, [], [aChain('c1', ['1', '2'])])).toThrow(InvalidChainBodyError);
  });
});
