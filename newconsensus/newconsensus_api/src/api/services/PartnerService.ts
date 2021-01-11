/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { PartnerRepository } from '../repositories/PartnerRepository';
import { Partner } from '../models/Partner';

@Service()
export class PartnerService {
    constructor(@OrmRepository() private partnerRepository: PartnerRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create partner
    public async create(partner: any): Promise<any> {
        this.log.info('Create a new partner ');
        return this.partnerRepository.save(partner);
    }

    // find one room
    public findOne(partner: any): Promise<any> {
        return this.partnerRepository.findOne(partner);
    }
    // find all room
    public findAll(): Promise<any> {
        this.log.info('Find all room');
        return this.partnerRepository.find();
    }

    // edit room
    public edit(id: any, partner: Partner): Promise<any> {
        this.log.info('Edit a partner');
        // room.id = id;
        return this.partnerRepository.save(partner);
    }

    // room List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return this.partnerRepository.count(condition);
        } else {
            return this.partnerRepository.find(condition);
        }
    }

    // delete room
    public async delete(id: number): Promise<any> {
        return await this.partnerRepository.delete(id);
    }
}
