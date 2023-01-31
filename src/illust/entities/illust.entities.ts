import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Meta } from './meta.entities';
import { Poly } from './poly.entities';
import { RemoteBase } from './remote_base.entities';

@Entity()
export class Illust {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  star: number;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @Column({ type: 'varchar', nullable: true })
  remote_type: string;

  @Column({ type: 'varchar', nullable: true })
  remote_endpoint: string;

  @Column({ type: 'varchar', nullable: true })
  thum_endpoint: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @ManyToMany(() => Poly, (poly) => poly.illusts)
  poly: Poly[];

  @OneToOne(() => Meta, (meta) => meta.illust, { cascade: true })
  meta: Meta;

  @ManyToOne(() => RemoteBase, (remote_base) => remote_base.illusts)
  remote_base: RemoteBase;

  @ManyToOne(() => RemoteBase, (thum_base) => thum_base.illusts_thum)
  thum_base: RemoteBase;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;
}