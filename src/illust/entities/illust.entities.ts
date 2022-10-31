import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
