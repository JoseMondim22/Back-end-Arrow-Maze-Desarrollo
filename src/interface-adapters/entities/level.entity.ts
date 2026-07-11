import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface BoardNodeData {
  id: string;
  type: string;
  direction?: string;
  row: number;
  column: number;
}

export interface BoardEdgeData {
  from: string;
  to: string;
}

export interface BoardData {
  nodes: BoardNodeData[];
  edges: BoardEdgeData[];
}

@Entity('levels')
export class LevelEntity {
  @PrimaryColumn('varchar', { length: 12 })
  id!: string;

  @Column('jsonb')
  boardData!: BoardData;

  @Column()
  timeLimit!: number;

  @Column()
  maxMoves!: number;

  @Column()
  maxPossibleScore!: number;

  @Column()
  difficulty!: number;

  @Column()
  order!: number;
}
