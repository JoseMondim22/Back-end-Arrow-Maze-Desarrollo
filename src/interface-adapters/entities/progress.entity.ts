import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('progress')
export class ProgressEntity {
  @PrimaryColumn('varchar', { length: 12 })
  id!: string;

  @Column()
  userId!: string;

  @Column()
  levelId!: string;

  @Column()
  bestScore!: number;
}
