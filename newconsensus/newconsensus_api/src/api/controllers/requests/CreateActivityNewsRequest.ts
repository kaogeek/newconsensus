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
export class CreateActivityNewsRequest {

    public coverImageUrl: string;

    public coverVideoUrl: string;

    @IsNotEmpty({
        message: 'title is required',
    })
    public title: string;

    @Type(() => Date)
    public startDateTime: Date;

    @Type(() => Date)
    public endDateTime: Date;

    public latitude: string;

    public longitude: string;

    public placeName: string;

    @IsNotEmpty({
        message: 'Content is required',
    })
    public content: string;

    public description: string;
    
}
