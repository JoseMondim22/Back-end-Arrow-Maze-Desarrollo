import { ApiProperty } from '@nestjs/swagger';

export class SyncDTO {
  @ApiProperty({ example: 'level-1' })
  readonly levelId: string;

  @ApiProperty({ example: 850 })
  readonly score: number;

  constructor(levelId: string, score: number) {
    this.levelId = levelId;
    this.score = score;
  }
}
