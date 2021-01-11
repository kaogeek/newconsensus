/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {IsNotEmpty, IsEmail} from 'class-validator';
export class UpdateCustomer {

    @IsNotEmpty()
    public customerGroupId: number;

    @IsNotEmpty()
    public username: string;

    @IsEmail()
    public email: string;

    @IsNotEmpty()
    public mobileNumber: number;

    public password: string;

    public confirmPassword: string;

    public avatar: string;

    public newsletter: number;

    @IsNotEmpty()
    public mailStatus: number;

    public status: number;
}
