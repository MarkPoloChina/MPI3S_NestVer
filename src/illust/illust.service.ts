import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IllustDto } from './dto/illust.dto';
import { Illust } from './entities/illust.entities';
import { Meta } from './entities/meta.entities';
import { Poly } from './entities/poly.entities';
import { RemoteBase } from './entities/remote_base.entities';
import { QueryHelper } from './util/queryHelper';

@Injectable()
export class IllustService {
  constructor(
    @InjectRepository(Illust)
    private readonly illustRepository: Repository<Illust>,
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
    @InjectRepository(Poly)
    private readonly polyRepository: Repository<Poly>,
    @InjectRepository(RemoteBase)
    private readonly remoteBaseRepository: Repository<RemoteBase>,
  ) {}

  async getPixivEnum(row: string, desc: number) {
    const results: any[] = await this.metaRepository
      .createQueryBuilder('meta')
      .select(row)
      .addSelect('COUNT(*)', 'count')
      .where(':row IS NOT NULL', { row: row })
      .groupBy(row)
      .orderBy(row, desc != 0 ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getIllustEnum(row: string, desc: number, requiredType?: string) {
    let queryBuilder = this.illustRepository
      .createQueryBuilder()
      .select(row)
      .addSelect(`COUNT(${row})`, 'count')
      .where(`${row} IS NOT NULL`);
    if (requiredType) {
      queryBuilder = queryBuilder.andWhere('type = :type', {
        type: requiredType,
      });
    }
    const results: any[] = await queryBuilder
      .groupBy(row)
      .orderBy(row, desc != 0 ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getPolyEnum(row: string, desc: number, requiredType?: string) {
    let queryBuilder = this.polyRepository
      .createQueryBuilder()
      .select(row)
      .addSelect(`COUNT(${row})`, 'count')
      .where(`${row} IS NOT NULL`);
    if (requiredType) {
      queryBuilder = queryBuilder.andWhere('type = :type', {
        type: requiredType,
      });
    }
    const results: any[] = await queryBuilder
      .groupBy(row)
      .orderBy(row, desc != 0 ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getIllustListByStdQuery(
    conditionJson: string,
    limit?: number,
    offset?: number,
    orderAs?: string,
    orderDesc?: number,
  ) {
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Illust.meta', 'meta')
      .leftJoinAndSelect('Illust.poly', 'poly')
      .leftJoinAndSelect('Illust.remote_base', 'remote_base')
      .leftJoinAndSelect('Illust.thum_base', 'thum_base')
      .where('Illust.id IS NOT NULL');
    const conditionObj = JSON.parse(conditionJson);
    Object.keys(conditionObj).forEach((colName, index) => {
      if (conditionObj[colName].length >= 1)
        querybuilder = querybuilder.andWhere(
          `(${colName} IN (:...row${index}))`,
          {
            [`row${index}`]: conditionObj[colName],
          },
        );
    });
    const results = await querybuilder
      .orderBy(orderAs, orderDesc != 0 ? 'DESC' : 'ASC')
      .addOrderBy('meta.page', 'ASC')
      .skip(offset)
      .take(limit)
      .getMany();
    return results;
  }

  async getIllustListCountByStdQuery(conditionJson: string) {
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .select('COUNT(Illust.id)', 'count')
      .leftJoin('Illust.meta', 'meta')
      .leftJoin('Illust.poly', 'poly')
      .where('Illust.id IS NOT NULL');
    const conditionObj = JSON.parse(conditionJson);
    Object.keys(conditionObj).forEach((colName, index) => {
      if (conditionObj[colName].length >= 1)
        querybuilder = querybuilder.andWhere(
          `(${colName} IN (:...row${index}))`,
          {
            [`row${index}`]: conditionObj[colName],
          },
        );
    });
    const results = await querybuilder.getRawOne();
    // dont use getCount()!! That will query and transfer all data that is too large.
    return results;
  }

  async getIllustListByFind(
    conditionJson: string,
    limit?: number,
    offset?: number,
    orderAs?: string,
    orderDesc?: number,
  ) {
    const conditionCartesianProd =
      QueryHelper.getConditionCartesianProd(conditionJson);
    const results: any[] = await this.illustRepository.find({
      where: conditionCartesianProd,
      relations: {
        meta: true,
      },
      skip: offset,
      take: limit,
      order: orderAs
        ? {
            [orderAs]: orderDesc != 0 ? 'DESC' : 'ASC',
          }
        : null,
    });
    return results;
  }

  async getPolyList(withIllust: number, type: string) {
    const result = await this.polyRepository.find({
      where: type
        ? {
            type: type,
          }
        : {},
      relations:
        withIllust != 0
          ? {
              illusts: {
                meta: true,
              },
            }
          : {},
      order: {
        parent: 'ASC',
        name: 'ASC',
        illusts: {
          meta: {
            pid: 'ASC',
            page: 'DESC',
          },
        },
      },
    });
    return result;
  }

  async newIllusts(illusts: IllustDto[]) {
    const resp_list = [];
    for (const illust of illusts) {
      const newIllust = new Illust();
      newIllust.type = illust.type;
      newIllust.star = illust.star;
      newIllust.date = illust.date;
      if (illust.meta) {
        newIllust.meta = new Meta();
        newIllust.meta.pid = illust.meta.pid;
        newIllust.meta.page = illust.meta.page;
        newIllust.meta.title = illust.meta.title;
        newIllust.meta.limit = illust.meta.limit;
      }
      if (illust.remote_info) {
        newIllust.remote_base = await this.remoteBaseRepository.findOneBy({
          id: illust.remote_info.remote_base_id,
        });
        newIllust.thum_base = await this.remoteBaseRepository.findOneBy({
          id: illust.remote_info.thum_base_id,
        });
        newIllust.remote_endpoint = illust.remote_info.remote_endpoint;
        newIllust.thum_endpoint = illust.remote_info.thum_endpoint;
        newIllust.remote_type = illust.remote_info.remote_type;
      }
      try {
        await this.illustRepository.save(newIllust);
        resp_list.push({ bid: illust.bid, status: 'success', message: 'OK' });
      } catch (err) {
        resp_list.push({
          bid: illust.bid,
          status: 'fault',
          message: `${err}`,
        });
      }
    }
    return { code: 200000, msg: 'process end', data: resp_list };
  }

  async updateIllusts(
    illusts: IllustDto[],
    addIfNotFound: number,
    byMatch: number,
  ) {
    const resp_list = [];
    for (const illust of illusts) {
      if (!illust.meta) {
        resp_list.push({
          bid: illust.bid,
          status: 'fault',
          message: 'NO Meta Represent.',
        });
        continue;
      }
      const targetMeta = await this.metaRepository.findOne({
        where:
          byMatch != 0
            ? { pid: illust.meta.pid, page: illust.meta.page }
            : {
                illust: {
                  id: illust.id,
                },
              },
        relations: {
          illust: true,
        },
      });
      if (!targetMeta) {
        if (addIfNotFound == 0) {
          resp_list.push({
            bid: illust.bid,
            status: 'ignore',
            message: 'META Not Found.',
          });
          continue;
        } else {
          const newIllust = new Illust();
          newIllust.type = illust.type;
          newIllust.star = illust.star;
          newIllust.date = illust.date;
          newIllust.meta = new Meta();
          newIllust.meta.pid = illust.meta.pid;
          newIllust.meta.page = illust.meta.page;
          newIllust.meta.title = illust.meta.title;
          newIllust.meta.limit = illust.meta.limit;
          try {
            await this.illustRepository.save(newIllust);
            resp_list.push({
              bid: illust.bid,
              status: 'success',
              message: 'Added',
            });
          } catch (err) {
            resp_list.push({
              bid: illust.bid,
              status: 'fault',
              message: `${err}`,
            });
          }
        }
      } else {
        if (illust.star) targetMeta.illust.star = illust.star;
        if (illust.date) targetMeta.illust.date = illust.date;
        if (illust.meta.title) targetMeta.title = illust.meta.title;
        if (illust.meta.limit) targetMeta.limit = illust.meta.limit;
        try {
          await this.metaRepository.save(targetMeta);
          await this.illustRepository.save(targetMeta.illust);
          resp_list.push({
            bid: illust.bid,
            status: 'success',
            message: 'Modified',
          });
        } catch (err) {
          resp_list.push({
            bid: illust.bid,
            status: 'fault',
            message: `${err}`,
          });
        }
      }
    }
    return { code: 200000, msg: 'process end', data: resp_list };
  }

  async removeIllustsFromPoly(polyId: number, ids: number[]) {
    const targetPoly = await this.polyRepository.findOne({
      where: { id: polyId },
      relations: {
        illusts: true,
      },
    });
    if (!targetPoly) return { code: 400000, msg: 'No Poly found' };
    else {
      for (const id of ids) {
        const idx = targetPoly.illusts.findIndex((value) => {
          return value.id == id;
        });
        if (idx == -1) continue;
        targetPoly.illusts.splice(idx, 1);
        try {
          await this.polyRepository.save(targetPoly);
        } catch (err) {
          console.log(err);
        }
      }
    }
    return { code: 200000, msg: 'OK' };
  }

  async deletePoly(polyId: number) {
    try {
      await this.polyRepository.delete(polyId);
      return { code: 200000, msg: 'OK' };
    } catch (err) {
      return { code: 500000, msg: err };
    }
  }
  async updatePoly(
    illusts: IllustDto[],
    type: string,
    parent: string,
    name: string,
    byMatch: number,
  ) {
    const resp_list = [];
    let targetPoly = await this.polyRepository.findOne({
      where: {
        type: type,
        parent: parent || null,
        name: name,
      },
      relations: {
        illusts: true,
      },
    });
    if (!targetPoly) {
      targetPoly = new Poly();
      targetPoly.name = name;
      targetPoly.parent = parent || null;
      targetPoly.type = type;
      targetPoly.illusts = [];
    }
    for (const illust of illusts) {
      const targetMeta = await this.metaRepository.findOne({
        where:
          byMatch != 0
            ? { pid: illust.meta.pid, page: illust.meta.page }
            : {
                illust: {
                  id: illust.id,
                },
              },
        relations: {
          illust: true,
        },
      });
      if (!targetMeta) {
        resp_list.push({
          bid: illust.bid,
          status: 'ignore',
          message: 'META Not Found.',
        });
        continue;
      } else {
        targetPoly.illusts.push(targetMeta.illust);
        try {
          await this.polyRepository.save(targetPoly);
          resp_list.push({ bid: illust.bid, status: 'success', message: 'OK' });
        } catch (err) {
          resp_list.push({
            bid: illust.bid,
            status: 'fault',
            message: `${err}`,
          });
        }
      }
    }
    return { code: 200000, msg: 'process end', data: resp_list };
  }

  async updatePolyByCondition(
    conditionJson: string,
    type: string,
    parent: string,
    name: string,
  ) {
    let targetPoly = await this.polyRepository.findOne({
      where: {
        type: type,
        parent: parent || null,
        name: name,
      },
      relations: {
        illusts: true,
      },
    });
    if (!targetPoly) {
      targetPoly = new Poly();
      targetPoly.name = name;
      targetPoly.parent = parent || null;
      targetPoly.type = type;
      targetPoly.illusts = [];
    }
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .leftJoin('Illust.meta', 'meta')
      .leftJoin('Illust.poly', 'poly')
      .leftJoin('Illust.remote_base', 'remote_base')
      .leftJoin('Illust.thum_base', 'thum_base')
      .select('Illust.id')
      .where('Illust.id IS NOT NULL');
    const conditionObj = JSON.parse(conditionJson);
    Object.keys(conditionObj).forEach((colName, index) => {
      if (conditionObj[colName].length >= 1)
        querybuilder = querybuilder.andWhere(
          `(${colName} IN (:...row${index}))`,
          {
            [`row${index}`]: conditionObj[colName],
          },
        );
    });
    const results = await querybuilder.getMany();
    for (const illust of results) {
      const targetMeta = await this.metaRepository.findOne({
        where: { id: illust.id },
        relations: {
          illust: true,
        },
      });
      targetPoly.illusts.push(targetMeta.illust);
      try {
        await this.polyRepository.save(targetPoly);
      } catch (err) {
        return { code: 500000, msg: `${err}` };
      }
    }
    return { code: 200000, msg: 'process end' };
  }

  async getRemoteBaseList(withIllust: number) {
    const result = await this.remoteBaseRepository.find({
      where: {},
      relations:
        withIllust != 0
          ? {
              illusts: {
                meta: true,
              },
            }
          : {},
      order: {
        name: 'ASC',
        illusts: {
          id: 'DESC',
        },
      },
    });
    return result;
  }
}
