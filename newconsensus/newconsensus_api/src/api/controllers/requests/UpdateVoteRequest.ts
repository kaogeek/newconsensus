/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVote {

    @IsNotEmpty({
        message: 'content is required',
    })
    public content: string;

    @IsNotEmpty({
        message: 'title is required',
    })
    public title: string;

    public isActive: any;

    public link: string;

    @Type(() => Date)
    public endDate: Date;

    public tagline: string;

    public coverImage: string;

    public videoUrl: string;

    public imageUrl: string;

    public description: string;
    
    public relateTag: string[];
}
