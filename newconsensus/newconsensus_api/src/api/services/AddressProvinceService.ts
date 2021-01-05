/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { AddressProvinceRepository } from '../repositories/AddressProvinceRepository';
import { AddressProvince } from '../models/AddressProvince';

@Service()
export class AddressProvinceService {

    constructor(@OrmRepository() private provinceRepository: AddressProvinceRepository) {
    }

    public findOne(province: any): Promise<any> {
        return this.provinceRepository.findOne(province);
    }

    public async delete(id: number): Promise<any> {
        await this.provinceRepository.delete(id);
        return;
    }

    public async create(province: any): Promise<AddressProvince> {
        return this.provinceRepository.save(province);
    }
}
