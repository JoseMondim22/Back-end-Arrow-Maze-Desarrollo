import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NodeRawData } from '../dtos/input/node-raw-data.dto';
import { EdgeRawData } from '../dtos/input/edge-raw-data.dto';
import { ChainRawData } from '../dtos/input/chain-raw-data.dto';

export interface BoardData {
  nodes: NodeRawData[];
  edges: EdgeRawData[];
  chains: ChainRawData[];
}

@Entity('levels')
export class LevelEntity {
  @PrimaryColumn('varchar', { length: 12 })
  id!: string;

  @Column('simple-json')
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
