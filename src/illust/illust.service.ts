import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Illust } from './entities/illust.entities';
import { Meta } from './entities/meta.entities';

@Injectable()
export class IllustService {
  constructor(
    @InjectRepository(Illust)
    private readonly illustRepository: Repository<Illust>,
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {}
  async getPixivEnumDate() {
    const results: any[] = await this.metaRepository
      .createQueryBuilder()
      .select('date')
      .addSelect('COUNT(*)', 'count')
      .where('date IS NOT NULL')
      .groupBy('date')
      .getRawMany();
    return results;
  }
  async getPixivList(query: Record<string, any>) {
    const { order, desc, offset, limit, ...condition } = query;
    const results: any[] = await this.metaRepository.find({
      where: {
        ...condition,
      },
      relations: {
        illust: true,
      },
      skip: offset,
      take: limit,
      order: order
        ? {
            [order]: desc ? 'DESC' : 'ASC',
          }
        : {},
    });
    return results;
  }
}
