/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { MainPageVideo } from '../models/MainPageVideo';
import { MainPageVideoRepository } from '../repositories/MainPageVideoRepository';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';

@Service()
export class MainPageVideoService {

    constructor(@OrmRepository() private mpVideoRepo: MainPageVideoRepository, @Logger(__filename) private log: LoggerInterface) {
    }

    // create Main Page Video
    public async create(mpVideo: MainPageVideo): Promise<MainPageVideo> {
        this.log.info('Create a new content => ', mpVideo.toString());
        const newMpVideo = this.mpVideoRepo.save(mpVideo);
        return newMpVideo;
    }

    // update Main Page Video
    public update(id: any, mpVideo: MainPageVideo): Promise<MainPageVideo> {
        this.log.info('Update a mpVideo');
        mpVideo.id = id;
        return this.mpVideoRepo.save(mpVideo);
    }

    // findone Main Page Video
    public findOne(mpVideo: any): Promise<any> {
        return this.mpVideoRepo.findOne(mpVideo);
    }

    // delete Main Page Video
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a user');
        return await this.mpVideoRepo.delete(id);
    }

    // Main Page Video List 
    public search(searchfilter: SearchFilter): Promise<any> {
        const limits = SearchUtil.getSearchLimit(searchfilter.limit);
        const condition: any = SearchUtil.createFindCondition(limits, searchfilter.offset, searchfilter.select, searchfilter.relation, searchfilter.whereConditions, searchfilter.orderBy);

        if (searchfilter.count) {
            return this.mpVideoRepo.count(condition);
        } else {
            return this.mpVideoRepo.find(condition);
        }
    }

    // find Main Page Video
    public find(content: any): Promise<any> {
        return this.mpVideoRepo.find(content);
    }

    // find Main Page Video ById
    public findById(id: any): Promise<any> {
        return this.mpVideoRepo.findByIds(id);
    }
}
