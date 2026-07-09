import { Level } from '../../src/domain/level/level.aggregate';
import { Board } from '../../src/domain/level/value-objects/board';
import { CellNode } from '../../src/domain/level/value-objects/cell-node';
import { ExitCell } from '../../src/domain/level/value-objects/exit-cell';
import { GridPosition } from '../../src/domain/level/value-objects/grid-position';
import { LevelId } from '../../src/domain/level/value-objects/level-id';
import { LevelOrder } from '../../src/domain/level/value-objects/level-order';
import { LevelRules } from '../../src/domain/level/value-objects/level-rules';
import { NodeId } from '../../src/domain/level/value-objects/node-id';

export class LevelMother {
  private static aBoardWithOnlyExit(): Board {
    const exitNode = CellNode.create(NodeId.create('1'), GridPosition.create(0, 0), ExitCell.create());
    return Board.create([exitNode], []);
  }

  static aLevel(): Level {
    return Level.create(
      LevelId.create('1'),
      LevelMother.aBoardWithOnlyExit(),
      LevelRules.create(60, 20, 100, 1),
      LevelOrder.create(1),
    );
  }

  static withId(id: string): Level {
    return Level.create(
      LevelId.create(id),
      LevelMother.aBoardWithOnlyExit(),
      LevelRules.create(60, 20, 100, 1),
      LevelOrder.create(1),
    );
  }

  static withMaxScore(maxPossibleScore: number): Level {
    return Level.create(
      LevelId.create('1'),
      LevelMother.aBoardWithOnlyExit(),
      LevelRules.create(60, 20, maxPossibleScore, 1),
      LevelOrder.create(1),
    );
  }

  static withBoard(board: Board): Level {
    return Level.create(
      LevelId.create('1'),
      board,
      LevelRules.create(60, 20, 100, 1),
      LevelOrder.create(1),
    );
  }

  static reconstitutedWithId(id: string): Level {
    return Level.reconstitute(
      LevelId.create(id),
      LevelMother.aBoardWithOnlyExit(),
      LevelRules.create(60, 20, 100, 1),
      LevelOrder.create(1),
    );
  }
}
