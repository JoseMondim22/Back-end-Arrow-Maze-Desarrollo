import { NodeRawData } from './node-raw-data.dto';
import { EdgeRawData } from './edge-raw-data.dto';

export class CreateLevelDTO {
  constructor(
    readonly nodes: NodeRawData[],
    readonly edges: EdgeRawData[],
    readonly timeLimit: number,
    readonly maxMoves: number,
    readonly maxPossibleScore: number,
    readonly difficulty: number,
    readonly order: number,
  ) {}
}
