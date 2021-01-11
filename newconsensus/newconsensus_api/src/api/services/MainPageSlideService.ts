/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { MainPageSlide } from '../models/MainPageSlide';
import { MainPageSlideRepository } from '../repositories/MainPageSlideRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';

@Service()
export class MainPageSlideService {

    constructor(@OrmRepository() private mpSlideRepo: MainPageSlideRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create Debate
    public async create(mpSlide: MainPageSlide): Promise<MainPageSlide> {
        this.log.info('Create a new content => ', mpSlide.toString());
        return this.mpSlideRepo.save(mpSlide);
    }

    // update Debate
    public update(id: any, mpSlide: MainPageSlide): Promise<MainPageSlide> {
        this.log.info('Update a mpSlide');
        mpSlide.id = id;
        return this.mpSlideRepo.save(mpSlide);
    }

    // findone Debate
    public findOne(mpSlide: any): Promise<any> {
        return this.mpSlideRepo.findOne(mpSlide);
    }

    // delete Debate
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a user');
        return await this.mpSlideRepo.delete(id);
    }

    // Debate List
    public search(searchfilter: SearchFilter): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy);

        if (searchfilter.count) {
            return this.mpSlideRepo.count(condition);
        } else {
            return this.mpSlideRepo.find(condition);
        }
    }

    // find Debate
    public find(content: any): Promise<any> {
        return this.mpSlideRepo.find(content);
    }

    // find Debate ById
    public findById(id: any): Promise<any> {
        return this.mpSlideRepo.findByIds(id);
    }
}
