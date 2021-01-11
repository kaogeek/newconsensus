/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVote {

    @IsNumber({}, {
        each: true,
        message: 'proposal id is number',
    })
    public proposalId: number;

    // @IsNotEmpty({
    //     message: 'room id is required',
    // })
    public roomId: number;

    @IsNotEmpty({
        message: 'content is required',
    })
    @IsString({
        each: true,
        message: 'content is string',
    })
    public content: string;

    @IsNotEmpty({
        message: 'title is required',
    })
    @IsString({
        message: 'title is string',
    })
    public title: string;

    @Type(() => Date)
    public endDate: Date;

    public link: string;

    @IsString({
        message: 'tagline is string',
    })
    public tagline: string;

    @IsNotEmpty({
        message: 'coverImage is required',
    })
    public coverImage: string;

    public videoUrl: string;

    public imageUrl: string;

    public isActive: boolean;

    public description: string;

    public relateTag: string[];
}
