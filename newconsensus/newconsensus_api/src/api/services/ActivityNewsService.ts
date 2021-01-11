/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';
import { AcitivityNewsRepository } from '../repositories/AcitivityNewsRepository';
import { ActivityNews } from '../models/ActivityNews';

@Service()
export class ActivityNewsService {

    constructor(@OrmRepository() private activityRepository: AcitivityNewsRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // create activity
    public async create(activity: any): Promise<any> {
        this.log.info('Create a new activity ');
        return this.activityRepository.save(activity);
    }

    // find one activity
    public findOne(activity: any): Promise<any> {
        return this.activityRepository.findOne(activity);
    }
     // find all activityNews
     public findAll(): Promise<any> {
        this.log.info('Find all activityNews');
        return this.activityRepository.find();
    }

    // edit activityNews
    public edit(id: any, activity: ActivityNews): Promise<any> {
        this.log.info('Edit a activityNews');
        activity.id = id;
        return this.activityRepository.save(activity);
    }

    // activityNews List
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {

        const condition: any = SearchUtil.createFindCondition(limit,offset,select,relation,whereConditions,orderBy);
        if (count) {
            return this.activityRepository.count(condition);
        } else {
            return this.activityRepository.find(condition);
        }
    }

    // delete activityNews
    public async delete(id: number): Promise<any> {
        return await this.activityRepository.delete(id);
    }
}
