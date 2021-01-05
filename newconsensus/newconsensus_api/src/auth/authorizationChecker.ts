/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import {Action} from 'routing-controllers';
import {Container} from 'typedi';
import {Connection} from 'typeorm';

import {Logger} from '../lib/logger';
import {AuthService} from './AuthService';

export function authorizationChecker(connection: Connection): (action: Action, roles: string[]) => Promise<boolean> | boolean {
    const log = new Logger(__filename);
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: any): Promise<boolean> {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        const userId = await authService.parseBasicAuthFromRequest(action.request);

        if (userId === undefined) {
            log.warn('No credentials given');
            return false;
        }

        if (roles[0] === 'customer') {
            console.log('userId check: '+userId);
            action.request.user = await authService.validateCustomer(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;

        } else {
            console.log('validate admin');
            action.request.user = await authService.validateUser(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;

        }
    };
}
