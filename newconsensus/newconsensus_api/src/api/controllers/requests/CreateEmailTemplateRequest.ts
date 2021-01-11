/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty , MaxLength } from 'class-validator';

export class CreateEmailTemplate {

    @MaxLength(30, {
        message: 'title is maximum 30 character',
    })
    @IsNotEmpty()
    public title: string;

    @IsNotEmpty()
    public subject: string;

    @IsNotEmpty()
    public content: string;

    @IsNotEmpty()
    public status: number;
}
