/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {IsNotEmpty, MaxLength, IsEmail} from 'class-validator';

export class UpdateUserRequest {

    @IsEmail({}, {
        message: 'Please provide username as emailId',
    })
    @IsNotEmpty({
        message: 'username is required',
    })
    public username: string;

    public password: string;

    @MaxLength(30, {
        message: 'First name is maximum 30 character',
    })
    @IsNotEmpty({
        message: 'First name is required',
    })
    public firstName: string;

    @MaxLength(30, {
        message: 'Last name is maximum 30 character',
    })
    @IsNotEmpty({
        message: 'Last name is required',
    })
    public lastName: string;

    @IsEmail({}, {
        message: 'Please provide valid email Id',
    })
    @IsNotEmpty({
        message: 'Email - Id is required',
    })
    public email: string;

    @IsNotEmpty({
        message: 'User Group Id is required',
    })
    public userGroupId: number;
}
