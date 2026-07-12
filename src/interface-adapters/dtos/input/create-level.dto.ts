import { ApiProperty } from '@nestjs/swagger';
import { NodeRawData } from './node-raw-data.dto';
import { EdgeRawData } from './edge-raw-data.dto';

export class CreateLevelDTO {
  @ApiProperty({ type: [NodeRawData] })
  readonly nodes: NodeRawData[];

  @ApiProperty({ type: [EdgeRawData] })
  readonly edges: EdgeRawData[];

  @ApiProperty({ example: 60 })
  readonly timeLimit: number;

  @ApiProperty({ example: 10 })
  readonly maxMoves: number;

  @ApiProperty({ example: 1000 })
  readonly maxPossibleScore: number;

  @ApiProperty({ example: 1 })
  readonly difficulty: number;

  @ApiProperty({ example: 1 })
  readonly order: number;

  constructor(
    nodes: NodeRawData[],
    edges: EdgeRawData[],
    timeLimit: number,
    maxMoves: number,
    maxPossibleScore: number,
    difficulty: number,
    order: number,
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.timeLimit = timeLimit;
    this.maxMoves = maxMoves;
    this.maxPossibleScore = maxPossibleScore;
    this.difficulty = difficulty;
    this.order = order;
  }
}
