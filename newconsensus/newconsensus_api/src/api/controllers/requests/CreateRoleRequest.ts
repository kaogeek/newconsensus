/*
 * NewConsensus API
 * version 2.2
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty} from 'class-validator';

export class CreateRole {

    @IsNotEmpty({
        message: 'name is required',
    })
    public name: string;

    @IsNotEmpty({
        message: 'status is required',
    })
    public status: number;
}
