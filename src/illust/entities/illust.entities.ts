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
import { Tag } from './tag.entities';

@Entity()
export class Illust {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  star: number;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  remote_endpoint: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @ManyToMany(() => Poly, (poly) => poly.illusts)
  poly: Poly[];

  @ManyToMany(() => Tag, (tag) => tag.illusts)
  tag: Tag[];

  @OneToOne(() => Meta, (meta) => meta.illust, { cascade: true })
  meta: Meta;

  @ManyToOne(() => RemoteBase, (remote_base) => remote_base.illusts)
  remote_base: RemoteBase;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;
}
