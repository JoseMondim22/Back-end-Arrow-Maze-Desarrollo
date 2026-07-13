import { ApiProperty } from '@nestjs/swagger';

export class PlayerProgressEntryDTO {
  @ApiProperty({ example: '1' })
  readonly levelId: string;

  @ApiProperty({ example: 950 })
  readonly bestScore: number;

  constructor(levelId: string, bestScore: number) {
    this.levelId = levelId;
    this.bestScore = bestScore;
  }
}
