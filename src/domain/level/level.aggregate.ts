import { Board } from './value-objects/board';
import { LevelId } from './value-objects/level-id';
import { LevelOrder } from './value-objects/level-order';
import { LevelRules } from './value-objects/level-rules';

export class Level {
  private readonly id: LevelId;
  private readonly board: Board;
  private readonly rules: LevelRules;
  private readonly order: LevelOrder;

  private constructor(id: LevelId, board: Board, rules: LevelRules, order: LevelOrder) {
    this.id = id;
    this.board = board;
    this.rules = rules;
    this.order = order;
  }

  static create(id: LevelId, board: Board, rules: LevelRules, order: LevelOrder): Level {
    return new Level(id, board, rules, order);
  }

  static reconstitute(id: LevelId, board: Board, rules: LevelRules, order: LevelOrder): Level {
    return new Level(id, board, rules, order);
  }

  isScorePlausible(score: number): boolean {
    return score <= this.rules.getMaxPossibleScore();
  }

  getId(): LevelId {
    return this.id;
  }

  getBoard(): Board {
    return this.board;
  }

  getRules(): LevelRules {
    return this.rules;
  }

  getOrder(): LevelOrder {
    return this.order;
  }
}
