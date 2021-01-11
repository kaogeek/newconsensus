/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty , MaxLength } from 'class-validator';

export class CreateCountry {

    @MaxLength(30, {
        message: 'name is maximum 30 character',
    })
    @IsNotEmpty()
    public name: string;

    @MaxLength(2, {
        message: 'isoCode2 is maximum 2 character',
    })
    @IsNotEmpty()
    public isoCode2: string;

    @MaxLength(3, {
        message: 'isoCode3 is maximum 3 character',
    })
    @IsNotEmpty()
    public isoCode3: string;

    @IsNotEmpty()
    public postcodeRequired: number;

    @IsNotEmpty()
    public status: number;

}
