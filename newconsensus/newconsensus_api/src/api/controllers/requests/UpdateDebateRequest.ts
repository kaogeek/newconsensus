/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '../../models/BaseModel';

export class UpdateDebate extends BaseModel {

    @IsNotEmpty({
        message: 'title is required',
    })
    public title: string;

    @IsNotEmpty({
        message: 'content is required',
    })
    public content: string;

    public pinOrdering: number;
    public relateTag: string[];
}
