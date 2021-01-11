/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { MainPageSlideLogsRepository } from '../repositories/MainPageSlideLogsRepository';
import { MainPageSlideLogs } from '../models/MainPageSlideLogs';

@Service()
export class MainPageSlideLogsService {

    constructor(@OrmRepository() private mpSlideLogsRepo: MainPageSlideLogsRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create Debate
    public async create(mpSlideLogs: MainPageSlideLogs): Promise<MainPageSlideLogs> {
        return this.mpSlideLogsRepo.save(mpSlideLogs);
    }

    // findone Debate
    public findOne(mpSlideLogs: any): Promise<any> {
        return this.mpSlideLogsRepo.findOne(mpSlideLogs);
    }

    // delete Debate
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a user');
        return await this.mpSlideLogsRepo.delete(id);
    }

    // Debate List
    public search(searchfilter: SearchFilter): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy);

        if (searchfilter.count) {
            return this.mpSlideLogsRepo.count(condition);
        } else {
            return this.mpSlideLogsRepo.find(condition);
        }
    }

    // find Debate
    public find(content: any): Promise<any> {
        return this.mpSlideLogsRepo.find(content);
    }

    // find Debate ById
    public findById(id: any): Promise<any> {
        return this.mpSlideLogsRepo.findByIds(id);
    }
}
