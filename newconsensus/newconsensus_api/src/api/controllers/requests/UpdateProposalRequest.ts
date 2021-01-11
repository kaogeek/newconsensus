/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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