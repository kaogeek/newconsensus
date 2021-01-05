/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateVoteComment {

    @IsNotEmpty({
        message: 'comment is required',
    })
    @IsString({
        message: 'comment is string',
    })
    public comment: string;

    @IsNotEmpty({
        message: 'value is required',
    })
    public value: string;
}
