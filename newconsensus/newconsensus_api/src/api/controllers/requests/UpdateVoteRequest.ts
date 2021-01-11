/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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
