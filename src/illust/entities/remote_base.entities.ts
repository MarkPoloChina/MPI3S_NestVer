import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Illust } from './illust.entities';

@Entity()
export class RemoteBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @OneToMany(() => Illust, (illust) => illust.remote_base)
  illusts: Illust[];

  @OneToMany(() => Illust, (illust) => illust.thum_base)
  illusts_thum: Illust[];
}
