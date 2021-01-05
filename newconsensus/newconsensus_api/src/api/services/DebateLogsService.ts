/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { DebateLogsRepository } from '../repositories/DebateLogsRepository';
import { DebateLogs } from '../models/DebateLogs';

@Service()
export class DebateLogsService {

    constructor(@OrmRepository() private dbLogsRepo: DebateLogsRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create Debate
    public async create(debateLogs: DebateLogs): Promise<DebateLogs> {
        return this.dbLogsRepo.save(debateLogs);
    }

    // findone Debate
    public findOne(debate: any): Promise<any> {
        return this.dbLogsRepo.findOne(debate);
    }

    // delete Debate
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a user');
        return await this.dbLogsRepo.delete(id);
    }

    // Debate List
    public search(searchfilter: SearchFilter): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy);

        if (searchfilter.count) {
            return this.dbLogsRepo.count(condition);
        } else {
            return this.dbLogsRepo.find(condition);
        }
    }

    // find Debate
    public find(content: any): Promise<any> {
        return this.dbLogsRepo.find(content);
    }

    // find Debate ById
    public findById(id: any): Promise<any> {
        return this.dbLogsRepo.findByIds(id);
    }
}
