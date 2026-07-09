import { Level } from '../../../../src/domain/level/level.aggregate';
import { LevelId } from '../../../../src/domain/level/value-objects/level-id';
import { LevelOrder } from '../../../../src/domain/level/value-objects/level-order';
import { LevelRules } from '../../../../src/domain/level/value-objects/level-rules';
import { Board } from '../../../../src/domain/level/value-objects/board';
import { CellNode } from '../../../../src/domain/level/value-objects/cell-node';
import { NodeId } from '../../../../src/domain/level/value-objects/node-id';
import { GridPosition } from '../../../../src/domain/level/value-objects/grid-position';
import { ExitCell } from '../../../../src/domain/level/value-objects/exit-cell';

function buildBoard(): Board {
  const node = CellNode.create(NodeId.create('1'), GridPosition.create(0, 0), ExitCell.create());
  return Board.create([node], []);
}

describe('Level', () => {
  it('should_keep_given_id_when_created', () => {
    // Arrange
    const id = LevelId.create('1');
    const board = buildBoard();
    const rules = LevelRules.create(60, 20, 100, 1);
    const order = LevelOrder.create(1);

    // Act
    const level = Level.create(id, board, rules, order);

    // Assert
    expect(level.getId().equals(id)).toBe(true);
    expect(level.getBoard()).toBe(board);
    expect(level.getRules()).toBe(rules);
    expect(level.getOrder().equals(order)).toBe(true);
  });

  it('should_keep_given_id_when_reconstituting_from_persistence', () => {
    // Arrange
    const id = LevelId.create('2');
    const board = buildBoard();
    const rules = LevelRules.create(60, 20, 100, 1);
    const order = LevelOrder.create(2);

    // Act
    const level = Level.reconstitute(id, board, rules, order);

    // Assert
    expect(level.getId().equals(id)).toBe(true);
  });

  it('should_consider_score_plausible_when_it_does_not_exceed_max_possible_score', () => {
    // Arrange
    const rules = LevelRules.create(60, 20, 100, 1);
    const level = Level.create(LevelId.create('1'), buildBoard(), rules, LevelOrder.create(1));

    // Act & Assert
    expect(level.isScorePlausible(100)).toBe(true);
  });

  it('should_consider_score_implausible_when_it_exceeds_max_possible_score', () => {
    // Arrange
    const rules = LevelRules.create(60, 20, 100, 1);
    const level = Level.create(LevelId.create('1'), buildBoard(), rules, LevelOrder.create(1));

    // Act & Assert
    expect(level.isScorePlausible(101)).toBe(false);
  });
});
