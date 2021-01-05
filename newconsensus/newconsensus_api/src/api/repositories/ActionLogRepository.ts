/*
 * spurtcommerce API
 * version 3.0
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { ActionLog } from '../models/ActionLog';

@EntityRepository(ActionLog)
export class ActionLogRepository extends Repository<ActionLog>  {

    public async countContentId(contentIds: string[], type: string, action?: string): Promise<any> {
        if (contentIds === undefined || contentIds === null || contentIds.length <= 0) {
            return Promise.resolve([]);
        }

        const data: any = { ids: contentIds, contentType: type };

        let actionStmt = '';
        if (action !== undefined && action !== null && action !== '') {
            actionStmt = ' and ActionLog.action =:action';
            data.action = action;
        }

        const query: any = await this.manager.createQueryBuilder(ActionLog, 'ActionLog');
        query.select(['ActionLog.content_id as contentId', 'ActionLog.type as contentType', 'ActionLog.action as action', 'COUNT(ActionLog.id) as count']);
        query.where('ActionLog.content_id IN (:...ids) and ActionLog.type =:contentType' + actionStmt, data);
        query.groupBy('contentId', 'contentType', 'action');
        query.orderBy('contentId', 'DESC');

        return query.getRawMany();
    }
}
