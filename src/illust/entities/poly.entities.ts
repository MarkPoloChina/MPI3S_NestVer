import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Illust } from './illust.entities';

@Entity()
export class Poly {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  parent: string;

  @ManyToMany(() => Illust, (illust) => illust.poly)
  @JoinTable()
  illusts: Illust[];
}
