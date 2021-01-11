/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import {EntityRepository, Repository} from 'typeorm';

import {LoginLog} from '../models/LoginLog';

@EntityRepository(LoginLog)
export class LoginLogRepository extends Repository<LoginLog> {
    public async logList(limit: number): Promise<any> {
        const query: any = await this.manager.createQueryBuilder(LoginLog, 'LoginLog');
        query.select(['COUNT(LoginLog.id) as logcount', 'DATE(created_date) as createdDate']);
        query.groupBy('createdDate');
        query.orderBy('createdDate', 'DESC');
        query.limit(limit);
        console.log(query.getQuery());
        return query.getRawMany();
    }

    public async pageUserLogList(pageUserId: number, limit: number): Promise<any> {
        const query: any = await this.manager.createQueryBuilder(LoginLog, 'LoginLog');
        query.select(['LoginLog.userId as userId','COUNT(LoginLog.id) as logcount', 'DATE(created_date) as createdDate']);
        query.where('LoginLog.userId = :id', {id: pageUserId});
        query.groupBy('createdDate');
        query.orderBy('createdDate', 'DESC');
        query.limit(limit);
        console.log(query.getQuery());
        return query.getRawMany();
    }
}
