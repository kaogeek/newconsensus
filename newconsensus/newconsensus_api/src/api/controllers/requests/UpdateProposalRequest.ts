/*
 * NewConsensus API
 * version 2.2
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { Type } from 'class-transformer';
import { BaseModel } from '../../models/BaseModel';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProposal extends BaseModel {

    @IsNumber(
    { allowNaN: false }, 
    { message: 'roomId must be an integer number' })
    public roomId: number;

    @IsNotEmpty({
        message: 'title is required',
    })
    public title: string;

    @IsNotEmpty({
        message: 'content is required',
    })
    public content: string;

    public reqSupporter: number;

    @Type(() => Date)
    public endDate: Date;

    public relateTag: string[];
    public debateTag: string;
    public videoUrl: string;
    public imageUrl: string;
}