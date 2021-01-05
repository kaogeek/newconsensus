/*
 * spurtcommerce API
 * version 3.0
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository} from 'typeorm';
import { UserExpStatement } from '../models/UserExpStatement';

@EntityRepository(UserExpStatement)
export class UserExpStatementRepository extends Repository<UserExpStatement>  {

    public async userExp(userId: string): Promise<any>{
        const query: any = await this.manager.createQueryBuilder(UserExpStatement, 'UserExpStatement');
        query.select(['SUM(UserExpStatement.value_exp) as expcount']);
        query.where('UserExpStatement.userId = :id', {id: userId});
        console.log(query.getQuery());
        return query.getRawMany();
    }
}
