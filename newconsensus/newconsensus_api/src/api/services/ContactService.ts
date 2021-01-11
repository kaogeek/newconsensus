/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import {ContactRepository} from '../repositories/ContactRepository';

@Service()
export class ContactService {

    constructor(@OrmRepository() private contactRepository: ContactRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // create contact info
    public async create(customer: any): Promise<any> {
        this.log.info('Create a Contact customer Infomation ');
        return this.contactRepository.save(customer);
    }
}
