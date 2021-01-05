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
import { MainPageVideoLogsRepository } from '../repositories/MainPageVideoLogsRepository';
import { MainPageVideoLogs } from '../models/MainPageVideoLogs';

@Service()
export class MainPageVideoLogsService {

    constructor(@OrmRepository() private mpVideoLogsRepo: MainPageVideoLogsRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create Debate
    public async create(mpVideoLogs: MainPageVideoLogs): Promise<MainPageVideoLogs> {
        return this.mpVideoLogsRepo.save(mpVideoLogs); 
    }

    // findone Debate
    public findOne(mpVideoLogs: any): Promise<any> {
        return this.mpVideoLogsRepo.findOne(mpVideoLogs);
    }

    // delete Debate
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a user');
        return await this.mpVideoLogsRepo.delete(id);
    }

    // Debate List
    public search(searchfilter: SearchFilter): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy);

        if (searchfilter.count) {
            return this.mpVideoLogsRepo.count(condition);
        } else {
            return this.mpVideoLogsRepo.find(condition);
        }
    }

    // find Debate
    public find(content: any): Promise<any> {
        return this.mpVideoLogsRepo.find(content);
    }

    // find Debate ById
    public findById(id: any): Promise<any> {
        return this.mpVideoLogsRepo.findByIds(id);
    }
}
