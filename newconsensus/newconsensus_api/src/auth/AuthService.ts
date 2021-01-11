/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */
 
import * as express from 'express';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { env } from '../env';
import { User } from '../api/models/User';
import { UserRepository } from '../api/repositories/UserRepository';
import { PageUserRepository } from '../api/repositories/PageUserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { FacebookService } from '../api/services/FacebookService';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private pageUserRepository: PageUserRepository, 
        private facebookService: FacebookService
    ) { }

    public async parseBasicAuthFromRequest(req: express.Request): Promise<number> {
        const authorization = req.header('authorization');
        const isFBMode = req.header('mode');

        console.log(authorization);
        console.log(authorization.split(' ')[0]);

        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            console.log('Credentials provided by the client');
            this.log.info('Credentials provided by the client');
            if (!authorization) {
                return undefined;
            }

            let UserId = undefined;
            // check in fb mode
            if(isFBMode === 'FB'){
                const pageUserObj = await this.facebookService.getPageUser(authorization.split(' ')[1]);

                if(pageUserObj !== undefined && pageUserObj.id !== undefined){
                    UserId = pageUserObj.id;
                }
            } else {
                UserId = await this.decryptToken(authorization.split(' ')[1]);
            }

            return UserId;
        }

        this.log.info('No credentials provided by the client');
        return undefined;
    }

    public async decryptToken(encryptString: string): Promise<number> {
        return new Promise<number>((subresolve, subreject) => {
            jwt.verify(encryptString, env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log(err);
                    return subresolve(undefined);
                }
                console.log(decoded);
                return subresolve(decoded.id);
            });
        });
    }

    public async validateUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        console.log(user);

        if (user) {
            return user;
        }

        return undefined;
    }

    public async validateCustomer(userId: number): Promise<any> {
        const customer = await this.pageUserRepository.findOne({
            where: {
                id : userId,
                deleteFlag: false /* only user that deleteFlag false valid */
            },
        });
        console.log(customer);

        if (customer) {
            return customer;
        }

        return undefined;
    }

}
