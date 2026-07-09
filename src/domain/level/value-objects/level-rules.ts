import { InvalidLevelRulesError } from '../errors';

export class LevelRules {
  private readonly timeLimit: number;
  private readonly maxMoves: number;
  private readonly maxPossibleScore: number;
  private readonly difficulty: number;

  private constructor(
    timeLimit: number,
    maxMoves: number,
    maxPossibleScore: number,
    difficulty: number,
  ) {
    this.timeLimit = timeLimit;
    this.maxMoves = maxMoves;
    this.maxPossibleScore = maxPossibleScore;
    this.difficulty = difficulty;
  }

  static create(
    timeLimit: number,
    maxMoves: number,
    maxPossibleScore: number,
    difficulty: number,
  ): LevelRules {
    if (!Number.isInteger(timeLimit) || timeLimit <= 0) {
      throw new InvalidLevelRulesError('timeLimit must be a positive integer.');
    }
    if (!Number.isInteger(maxMoves) || maxMoves <= 0) {
      throw new InvalidLevelRulesError('maxMoves must be a positive integer.');
    }
    if (!Number.isInteger(maxPossibleScore) || maxPossibleScore <= 0) {
      throw new InvalidLevelRulesError('maxPossibleScore must be a positive integer.');
    }
    if (!Number.isInteger(difficulty) || difficulty < 1) {
      throw new InvalidLevelRulesError('difficulty must be a positive integer.');
    }
    return new LevelRules(timeLimit, maxMoves, maxPossibleScore, difficulty);
  }

  getTimeLimit(): number {
    return this.timeLimit;
  }

  getMaxMoves(): number {
    return this.maxMoves;
  }

  getMaxPossibleScore(): number {
    return this.maxPossibleScore;
  }

  getDifficulty(): number {
    return this.difficulty;
  }
}
