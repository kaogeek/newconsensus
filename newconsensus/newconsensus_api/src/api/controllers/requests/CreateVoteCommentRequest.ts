/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateVoteComment {

    @IsNotEmpty({
        message: 'comment is required',
    })
    public comment: string;

    @IsNotEmpty({
        message: 'value is required',
    })
    public value: string;
}
