/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Like } from 'typeorm/index';
import {PageUserRepository} from '../repositories/PageUserRepository';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class PageUserService {

    constructor(@OrmRepository() private customerRepository: PageUserRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        this.log.info('Create a new customer ');
        return this.customerRepository.save(customer);
    }

    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.customerRepository.findOne(customer);
    }

    // update customer
    public update(id: any, customer: any): Promise<any> {
        customer.customerId = id;
        return this.customerRepository.save(customer);
    }
    // update customer
    public updateExpUser(id: any, customer: any): Promise<any> {
        return this.customerRepository.save(customer);
    }
    // customer List
    public list(limit: any, offset: any, search: any = [], whereConditions: any = [], order: number, count: number|boolean): Promise<any> {
        const condition: any = {};

        condition.where = {};

        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                condition.where[item.name] = item.value;
            });
        }

        if (search && search.length > 0) {
            search.forEach((table: any) => {
                const operator: string = table.op;
                if (operator === 'where' && table.value !== '') {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== '') {
                    condition.where[table.name] = Like('%' + table.value + '%');
                }
            });
        }

        if (order && order > 0) {
            condition.order = {
                createdDate: 'DESC',
            };
            condition.take = 5;

        }

        condition.order = {
            createdDate: 'DESC',
        };

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }
        if (count) {
            return this.customerRepository.count(condition);
        } else {
            return this.customerRepository.find(condition);
        }
    }
    // delete customer
    public async delete(id: number): Promise<any> {
        return await this.customerRepository.delete(id);
    }
    // today customer count
    public async todayCustomerCount(todaydate: string): Promise<any> {

        return await this.customerRepository.TodayCustomerCount(todaydate);

    }
    public async findAll(): Promise<any>{
        this.log.info('Find all PageUser');
        return await this.customerRepository.find();
    }
    
    public search(limit: any, offset: any, select: any = [], relation: any = [], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.customerRepository.count(condition);
        } else {
            return this.customerRepository.find(condition);
        }
    }
    public cleanPageUserField(user: any): any {
        if (user !== undefined && user !== null) {
                const clearItem = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    displayName: user.displayName,
                    avatarPath: user.avatarPath,
                    avatar: user.avatar,
                    isOfficial: user.isOfficial,
                    level: user.level,
                    currentExp: user.currentExp
                };
                user = clearItem;
        }
        return user;
    }
}
