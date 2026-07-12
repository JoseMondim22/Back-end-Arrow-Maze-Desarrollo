import { ApiProperty } from '@nestjs/swagger';
import { BoardDTO } from './board.dto';

export class LevelDTO {
  @ApiProperty({ example: 'level-1' })
  readonly id: string;

  @ApiProperty({ type: BoardDTO })
  readonly board: BoardDTO;

  @ApiProperty({ example: 60 })
  readonly timeLimit: number;

  @ApiProperty({ example: 10 })
  readonly maxMoves: number;

  @ApiProperty({ example: 1 })
  readonly difficulty: number;

  @ApiProperty({ example: 1 })
  readonly order: number;

  constructor(
    id: string,
    board: BoardDTO,
    timeLimit: number,
    maxMoves: number,
    difficulty: number,
    order: number,
  ) {
    this.id = id;
    this.board = board;
    this.timeLimit = timeLimit;
    this.maxMoves = maxMoves;
    this.difficulty = difficulty;
    this.order = order;
  }
}
