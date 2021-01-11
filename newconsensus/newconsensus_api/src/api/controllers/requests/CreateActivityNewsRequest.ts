/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
