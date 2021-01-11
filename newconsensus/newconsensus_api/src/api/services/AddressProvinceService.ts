/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
