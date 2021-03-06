/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
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