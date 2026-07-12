import { Level } from '../../src/domain/level/level.aggregate';
import { Board } from '../../src/domain/level/value-objects/board';
import { CellNode } from '../../src/domain/level/value-objects/cell-node';
import { Chain } from '../../src/domain/level/value-objects/chain';
import { ChainId } from '../../src/domain/level/value-objects/chain-id';
import { EmptyCell } from '../../src/domain/level/value-objects/empty-cell';
import { ExitCell } from '../../src/domain/level/value-objects/exit-cell';
import { GridArrowCell } from '../../src/domain/level/value-objects/grid-arrow-cell';
import { GridDirection } from '../../src/domain/level/value-objects/grid-direction';
import { GridPosition } from '../../src/domain/level/value-objects/grid-position';
import { LevelId } from '../../src/domain/level/value-objects/level-id';
import { LevelOrder } from '../../src/domain/level/value-objects/level-order';
import { LevelRules } from '../../src/domain/level/value-objects/level-rules';
import { NodeId } from '../../src/domain/level/value-objects/node-id';

export class LevelMother {
  private static aBoardWithOnlyExit(): Board {
    const exitNode = CellNode.create(NodeId.create('1'), GridPosition.create(0, 0), ExitCell.create());
    return Board.create([exitNode], [], []);
  }

  static aBoardWithOneChain(): Board {
    const bodyNode = CellNode.create(NodeId.create('1'), GridPosition.create(0, 0), EmptyCell.create());
    const headNode = CellNode.create(
      NodeId.create('2'),
      GridPosition.create(0, 1),
      GridArrowCell.create(GridDirection.create('up')),
    );
    const exitNode = CellNode.create(NodeId.create('3'), GridPosition.create(0, 2), ExitCell.create());
    const chain = Chain.create(ChainId.create('c1'), [NodeId.create('1'), NodeId.create('2')]);
    return Board.create([bodyNode, headNode, exitNode], [], [chain]);
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
