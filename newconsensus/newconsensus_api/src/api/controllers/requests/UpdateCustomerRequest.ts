/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty, IsEmail} from 'class-validator';
export class UpdateCustomer {

    @IsNotEmpty()
    public customerGroupId: number;

    @IsNotEmpty()
    public username: string;

    @IsEmail()
    public email: string;

    @IsNotEmpty()
    public mobileNumber: number;

    public password: string;

    public confirmPassword: string;

    public avatar: string;

    public newsletter: number;

    @IsNotEmpty()
    public mailStatus: number;

    public status: number;
}
