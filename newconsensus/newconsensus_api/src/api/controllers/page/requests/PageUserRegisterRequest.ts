/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {IsNotEmpty, MinLength} from 'class-validator';
import {BasePageUserRegisterRequest} from './BasePageUserRegisterRequest';
export class PageUserRegisterRequest extends BasePageUserRegisterRequest{

    // use for username mode
    @MinLength(5, {
        message: 'password is minimum 5 character',
    })
    @IsNotEmpty({
        message: 'password is required',
    })
    public password: string;

    @MinLength(5, {
        message: 'Confirm password is minimum 5 character',
    })
    @IsNotEmpty({
        message: 'Confirm password password is required',
    })
    public confirmPassword: string;
    
}
