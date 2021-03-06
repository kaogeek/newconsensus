/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateVoteComment {

    @IsNotEmpty({
        message: 'comment is required',
    })
    @IsString({
        message: 'comment is string',
    })
    public comment: string;

    @IsNotEmpty({
        message: 'value is required',
    })
    public value: string;
}
