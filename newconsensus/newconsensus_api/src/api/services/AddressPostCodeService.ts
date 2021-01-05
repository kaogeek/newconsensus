/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SearchUtil } from '../../utils/SearchUtil';
import { SearchFilter } from '../controllers/requests/SearchFilterRequest';
import { AddressPostcodeRepository } from '../repositories/AddressPostcodeRepository';
import { AddressPostcode } from '../models/AddressPostcode';

@Service()
export class AddressPostcodeService {

    constructor(@OrmRepository() private postcodeRepository: AddressPostcodeRepository) {
    }

    public findZipcode(postcode: string): Promise<AddressPostcode> {
        const condition = {
            where: [{
                postcode
            }],
        };
        return this.postcodeRepository.findOne(condition);
    }

     // Postcode List
     public search(filter: SearchFilter): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(filter.limit, filter.offset, filter.select, filter.relation, filter.whereConditions, filter.orderBy);
        if (filter.count) {
            return this.postcodeRepository.count(condition);
        } else {
            return this.postcodeRepository.query('SELECT DISTINCT postcode, province FROM address_postcode where '+condition.where+' ');
        }
    }

    public findOne(id: any): Promise<any> {
        return this.postcodeRepository.findOne(id);
    }

    public async delete(id: number): Promise<any> {
        await this.postcodeRepository.delete(id);
        return;
    }

    public async create(zipcode: any): Promise<AddressPostcode> {
        return this.postcodeRepository.save(zipcode);
    }
}
