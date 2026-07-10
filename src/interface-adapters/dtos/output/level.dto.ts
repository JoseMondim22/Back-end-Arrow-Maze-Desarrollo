import { BoardDTO } from './board.dto';

export class LevelDTO {
  constructor(
    readonly id: string,
    readonly board: BoardDTO,
    readonly timeLimit: number,
    readonly maxMoves: number,
    readonly difficulty: number,
    readonly order: number,
  ) {}
}
