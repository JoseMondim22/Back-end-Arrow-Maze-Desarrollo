export interface CreateLevelNodeInput {
  id: string;
  type: string;
  row: number;
  column: number;
  direction?: string;
}

export interface CreateLevelEdgeInput {
  from: string;
  to: string;
}

export class CreateLevelCommand {
  constructor(
    readonly nodes: CreateLevelNodeInput[],
    readonly edges: CreateLevelEdgeInput[],
    readonly timeLimit: number,
    readonly maxMoves: number,
    readonly maxPossibleScore: number,
    readonly difficulty: number,
    readonly order: number,
  ) {}
}
