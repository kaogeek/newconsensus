/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { Type } from 'class-transformer';
// import { IsDateString } from 'class-validator';
export class UpdateActivityNewsRequest {

    public coverImageUrl: string;

    public coverVideoUrl: string;
    
    public title: string;
    
    @Type(() => Date)
    public startDateTime: Date;

    @Type(() => Date)
    public endDateTime: Date;

    public latitude: string;

    public longitude: string;

    public placeName: string;

    public content: string;

    public description: string;
    
}
