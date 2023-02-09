import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { IllustDto } from './dto/illust.dto';
import { Illust } from './entities/illust.entities';
import { Meta } from './entities/meta.entities';
import { Poly } from './entities/poly.entities';
import { RemoteBase } from './entities/remote_base.entities';
import { Tag } from './entities/tag.entities';

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
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getPixivEnum(row: string, desc: boolean) {
    const results: any[] = await this.metaRepository
      .createQueryBuilder('meta')
      .select(row)
      .addSelect('COUNT(*)', 'count')
      .where(':row IS NOT NULL', { row: row })
      .groupBy(row)
      .orderBy(row, desc ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getIllustEnum(row: string, desc: boolean, requiredType?: string) {
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
      .orderBy(row, desc ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getPolyEnum(row: string, desc: boolean, requiredType?: string) {
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
      .orderBy(row, desc ? 'DESC' : 'ASC')
      .getRawMany();
    return results;
  }

  async getIllustListByQuery(
    conditionObj: object,
    limit?: number,
    offset?: number,
    orderAs?: string,
    orderDesc?: boolean,
  ) {
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Illust.meta', 'meta')
      .leftJoinAndSelect('Illust.poly', 'poly')
      .leftJoinAndSelect('Illust.tag', 'tag')
      .leftJoinAndSelect('Illust.remote_base', 'remote_base')
      .leftJoinAndSelect('Illust.thum_base', 'thum_base')
      .where('Illust.id IS NOT NULL');
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
      .orderBy(orderAs, orderDesc ? 'DESC' : 'ASC')
      .addOrderBy('meta.page', 'ASC')
      .skip(offset)
      .take(limit)
      .getMany();
    return results;
  }

  async getIllustListCountByQuery(conditionObj: object) {
    let querybuilder: SelectQueryBuilder<Illust> = this.illustRepository
      .createQueryBuilder()
      .select('COUNT(Illust.id)', 'count')
      .leftJoin('Illust.meta', 'meta')
      .leftJoin('Illust.poly', 'poly')
      .leftJoin('Illust.tag', 'tag')
      .where('Illust.id IS NOT NULL');
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

  async getPolyList(withIllust: boolean, type: string) {
    if (type == 'picolt' && withIllust) {
      const result = await this.polyRepository.find({
        where: {
          type: type,
          illusts: {
            type: 'pixiv',
          },
        },
        relations: {
          illusts: {
            meta: true,
            remote_base: true,
            thum_base: true,
          },
        },
        order: {
          parent: 'ASC',
          name: 'ASC',
          illusts: {
            meta: {
              pid: 'ASC',
              page: 'ASC',
            },
            id: 'ASC',
          },
        },
      });
      const result2 = await this.polyRepository.find({
        where: {
          type: type,
          illusts: {
            type: Not('pixiv'),
          },
        },
        relations: {
          illusts: {
            remote_base: true,
            thum_base: true,
          },
        },
        order: {
          parent: 'ASC',
          name: 'ASC',
          illusts: {
            id: 'ASC',
          },
        },
      });
      result2.forEach((poly) => {
        const cur = result.find((value) => {
          return value.id == poly.id;
        });
        if (cur) cur.illusts.push(...poly.illusts);
      });
      return result;
    }
    const result = await this.polyRepository.find({
      where: type
        ? {
            type: type,
          }
        : {},
      relations: withIllust
        ? {
            illusts: {
              meta: true,
              remote_base: true,
              thum_base: true,
            },
          }
        : {},
      order: {
        type: 'ASC',
        parent: 'ASC',
        name: 'ASC',
        illusts: {
          meta: {
            pid: 'ASC',
            page: 'ASC',
          },
          id: 'ASC',
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

  async updateIllusts(illusts: IllustDto[], addIfNotFound: boolean) {
    const resp_list = [];
    for (const illust of illusts) {
      let targetIllust: Illust;
      if (illust.id)
        targetIllust = await this.illustRepository.findOne({
          where: {
            id: illust.id,
          },
          relations: {
            meta: true,
            tag: true,
          },
        });
      else if (illust.meta)
        targetIllust = await this.illustRepository.findOne({
          where: {
            meta: {
              pid: illust.meta.pid,
              page: illust.meta.page,
            },
          },
          relations: {
            meta: true,
            tag: true,
          },
        });
      if (!targetIllust) {
        if (!addIfNotFound) {
          resp_list.push({
            bid: illust.bid,
            status: 'ignore',
            message: 'Illust Not Found.',
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
        if (illust.star || illust.star === 0) targetIllust.star = illust.star;
        if (illust.date) targetIllust.date = illust.date;
        if (illust.meta.title) targetIllust.meta.title = illust.meta.title;
        if (illust.meta.limit) targetIllust.meta.limit = illust.meta.limit;
        if (illust.tag && illust.tag.length >= 1) {
          for (const ele of illust.tag) {
            if (
              targetIllust.tag.findIndex((value) => {
                return value.name == ele;
              }) == -1
            ) {
              let targetTag: Tag;
              targetTag = await this.tagRepository.findOneBy({ name: ele });
              if (!targetTag) {
                targetTag = new Tag();
                targetTag.name = ele;
                targetTag.type = 'simple';
                await this.tagRepository.save(targetTag);
              }
              targetIllust.tag.push(targetTag);
            }
          }
        }
        try {
          await this.illustRepository.save(targetIllust);
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
      // 请仿照下面进行优化！！！
      let targetIllust;
      if (illust.id)
        targetIllust = await this.illustRepository.findOneBy({
          id: illust.id,
        });
      else if (illust.meta)
        targetIllust = await this.illustRepository.findOneBy({
          meta: {
            pid: illust.meta.pid,
            page: illust.meta.page,
          },
        });
      else if (illust.remote_info)
        targetIllust = await this.illustRepository.findOneBy({
          remote_endpoint: illust.remote_info.remote_endpoint,
        });
      if (!targetIllust) {
        resp_list.push({
          bid: illust.bid,
          status: 'ignore',
          message: 'Illust Not Found.',
        });
        continue;
      } else {
        targetPoly.illusts.push(targetIllust);
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
    conditionObj: object,
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
      const targetIllust = await this.illustRepository.findOneBy({
        id: illust.id,
      });
      targetPoly.illusts.push(targetIllust);
      try {
        await this.polyRepository.save(targetPoly);
      } catch (err) {
        return { code: 500000, msg: `${err}` };
      }
    }
    return { code: 200000, msg: 'process end' };
  }

  async getRemoteBaseList(withIllust: boolean) {
    const result = await this.remoteBaseRepository.find({
      where: {},
      relations: withIllust
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
