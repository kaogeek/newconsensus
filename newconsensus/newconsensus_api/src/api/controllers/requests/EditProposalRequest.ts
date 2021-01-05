/*
 * NewConsensus API
 * version 2.2
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class EditProposal {

    public id: number;
    
    public roomId: number;

    @IsNotEmpty({
        message: 'content is required',
    })
    public content: string;

    public reqSupporter: number;

    public approveUserId: number;

    public approveDate: Date;

    public likeCount: number;

    public dislikeCount: number;

    public endDate: Date;
    
}