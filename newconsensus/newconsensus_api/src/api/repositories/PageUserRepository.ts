/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { PageUser } from '../models/PageUser';

@EntityRepository(PageUser)
export class PageUserRepository extends Repository<PageUser>  {

    public async TodayCustomerCount(todaydate: string): Promise<any> {

        const query: any = await this.manager.createQueryBuilder(PageUser, 'pageuser');
        query.select([  'COUNT(pageuser.id) as customerCount']);
        query.where('DATE(pageuser.createdDate) = :todaydate', {todaydate});
        return query.getRawOne();
    }
}
