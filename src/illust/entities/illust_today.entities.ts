import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Illust } from './illust.entities';

@Entity()
export class IllustToday {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @OneToOne(() => Illust)
  @JoinColumn()
  illust: Illust;
}
