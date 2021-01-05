/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty, MinLength} from 'class-validator';
import {BasePageUserRegisterRequest} from './BasePageUserRegisterRequest';
export class PageUserRegisterRequest extends BasePageUserRegisterRequest{

    // use for username mode
    @MinLength(5, {
        message: 'password is minimum 5 character',
    })
    @IsNotEmpty({
        message: 'password is required',
    })
    public password: string;

    @MinLength(5, {
        message: 'Confirm password is minimum 5 character',
    })
    @IsNotEmpty({
        message: 'Confirm password password is required',
    })
    public confirmPassword: string;
    
}
