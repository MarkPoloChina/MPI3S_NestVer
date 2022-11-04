import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { Meta } from './meta.entities';
import { Poly } from './poly.entities';

@Entity()
export class Illust {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'int', nullable: true })
  star: number;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @Column({ type: 'varchar', nullable: true })
  remote_type: string;

  @Column({ type: 'varchar', nullable: true })
  remote_base: string;

  @Column({ type: 'varchar', nullable: true })
  remote_endpoint: string;

  @Column({ type: 'varchar', nullable: true })
  thum_base: string;

  @Column({ type: 'varchar', nullable: true })
  thum_endpoint: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @ManyToOne(() => Poly, (poly) => poly.illusts)
  poly: Poly;

  @OneToOne(() => Meta, (meta) => meta.illust)
  meta: Meta;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;
}
