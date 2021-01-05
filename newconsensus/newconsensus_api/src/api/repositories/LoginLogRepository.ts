/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
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
