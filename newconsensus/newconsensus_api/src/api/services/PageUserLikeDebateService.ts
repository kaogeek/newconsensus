/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { PageUserLikeDebate } from '../models/PageUserLikeDebate';
import { PageUserLikeDebateRepository } from '../repositories/PageUserLikeDebateRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';

@Service()
export class PageUserLikeDebateService {

    constructor(@OrmRepository() private pageUserLikeDebateRepository: PageUserLikeDebateRepository) {
    }

    // create PageUserLikeDebate
    public async create(pageUserLikeDebate: PageUserLikeDebate): Promise<PageUserLikeDebate> {
        if (pageUserLikeDebate.isLike) {
            pageUserLikeDebate.isLike = true;
        } else {
            pageUserLikeDebate.isLike = false;
        }

        return this.pageUserLikeDebateRepository.save(pageUserLikeDebate);
    }

    // update PageUserLikeDebate
    public update(pageUserLikeDebate: any): Promise<any> {
        return this.pageUserLikeDebateRepository.save(pageUserLikeDebate);
    }

    // findone PageUserLikeDebate
    public findOne(pageUserLikeDebate: any): Promise<any> {
        return this.pageUserLikeDebateRepository.findOne(pageUserLikeDebate);
    }

    // delete PageUserLikeDebate
    public async delete(uId: number, dbId: number): Promise<any> {
        return this.pageUserLikeDebateRepository.delete({ userId: uId, debateId: dbId });
    }

    // PageUserLikeDebate List
    public search(searchFilter: SearchFilter): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(searchFilter.limit, searchFilter.offset, searchFilter.select, searchFilter.relation, searchFilter.whereConditions, searchFilter.orderBy);

        if (searchFilter.count) {
            return this.pageUserLikeDebateRepository.count(condition);
        } else {
            return this.pageUserLikeDebateRepository.find(condition);
        }
    }

    // find PageUserLikeDebate
    public find(pageUserLikeDebate: any): Promise<any> {
        return this.pageUserLikeDebateRepository.find(pageUserLikeDebate);
    }
}
