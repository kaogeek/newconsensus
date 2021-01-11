/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Like } from 'typeorm';
import { MAX_SEARCH_ROWS } from '../Constants';

export class SearchUtil {

    // !implement escape
    public static getEscapeString(value: string): string {
        return value;
    }

    /*
     * Create Find Condition 
     * {
     *    select: [],
     *    relations: [],
     *    join: {},
     *    where: {}|[],
     *    order: {},
     *    skip: number, //offset
     *    take: number // limit
     * }
     */
    public static createFindCondition(limit: number, offset: number, select: any[], relation: any[], whereConditions: any = [], orderBy: any, join?: any): any {
        const condition: any = {};
        if (select && select.length > 0) {
            condition.select = select;
        }
        
        if (relation && relation.length > 0) {
            condition.relations = relation;
        }
        condition.where = whereConditions;

        if (select && select.length > 0) {
            select.forEach((table: any) => {
                const operator: string = table.op;
                if (operator === 'where' && table.value !== undefined) {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== undefined) {
                    condition.where[table.name] = Like('%' + table.value + '%');
                }
            });
        }

        if (join) {
            condition.join = join;
        }
        condition.order = orderBy;

        const limits = this.getSearchLimit(limit);
        if (limits && limits > 0) {
            condition.take = limits;
            condition.skip = offset;
        }
        return condition;
    }

    public static getSearchLimit(limit: any): any {
        if (limit <= MAX_SEARCH_ROWS) {
            return limit;
        } else if (limit > MAX_SEARCH_ROWS || limit === undefined) {
            const limits = MAX_SEARCH_ROWS;
            return limits;
        }
        // null case must return undefined
        return undefined;
    }

    public static getDateTimeString(date: Date): string {
        if (date !== undefined && date !== null) {
            return date.toJSON().slice(0, 19).replace('T', ' ');
        }

        return null;
    }
}
