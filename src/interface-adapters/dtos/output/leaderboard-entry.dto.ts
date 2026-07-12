import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntryDTO {
  @ApiProperty({ example: 1 })
  readonly position: number;

  @ApiProperty({ example: 'player1' })
  readonly username: string;

  @ApiProperty({ example: 950 })
  readonly score: number;

  constructor(position: number, username: string, score: number) {
    this.position = position;
    this.username = username;
    this.score = score;
  }
}
