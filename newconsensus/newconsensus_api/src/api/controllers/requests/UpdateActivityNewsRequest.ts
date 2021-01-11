/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
