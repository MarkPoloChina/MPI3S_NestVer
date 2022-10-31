import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Illust } from './illust.entities';

@Entity()
export class Meta {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: false })
  pid: number;

  @Column({ type: 'int', nullable: false })
  page: number;

  @Column({ type: 'varchar', nullable: true, length: 45 })
  author: string;

  @Column({ type: 'int', nullable: true })
  author_id: number;

  @Column({ type: 'varchar', nullable: true, length: 128 })
  title: string;

  @Column({ type: 'varchar', nullable: true, length: 45 })
  limit: string;

  @Column({ type: 'int', nullable: true })
  book_cnt: number;

  @Column({ type: 'datetime', nullable: true })
  timestamp: Date;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @OneToOne(() => Illust)
  @JoinColumn()
  illust: Illust;
}
