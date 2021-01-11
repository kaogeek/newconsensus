/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import {AccessTokenRepository} from '../repositories/AccessTokenRepository';
import {AccessToken} from '../models/AccessTokenModel';

@Service()
export class AccessTokenService {

    constructor(@OrmRepository() private accessTokenRepository: AccessTokenRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    public findOne(accessToken: any): Promise<any> {
        return this.accessTokenRepository.findOne(accessToken);
    }
    // delete token
    public async delete(id: number): Promise<any> {
        this.log.info('Delete a token');
        await this.accessTokenRepository.delete(id);
        return;
    }
    // create token
    public async create(accessToken: any): Promise <AccessToken> {
        return this.accessTokenRepository.save(accessToken);
    }
}
