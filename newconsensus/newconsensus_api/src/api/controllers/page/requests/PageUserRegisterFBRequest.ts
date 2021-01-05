/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';
import {BasePageUserRegisterRequest} from './BasePageUserRegisterRequest';
export class PageUserRegisterFBRequest extends BasePageUserRegisterRequest{

    // facebook authen field
    @IsNotEmpty({
        message: 'Facebook UserId is required',
    })
    public fbUserId: string;

    @IsNotEmpty({
        message: 'Facebook Token is required',
    })
    public fbToken: string;

    @IsNotEmpty({
        message: 'Facebook ExpirationTime is required',
    })
    public fbAccessExpirationTime: number;

    @IsNotEmpty({
        message: 'Facebook SignedRequest is required',
    })
    public fbSignedRequest: string;

    // public emailId: string;

    // public identificationCode: string;
}
