/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty , MinLength, MaxLength } from 'class-validator';

export class ChangePassword {

    @MaxLength(15, {
        message: 'Old Password is maximum 15 character',
    })
    @MinLength(5, {
        message: 'Old Password is minimum 5 character',
    })
    @IsNotEmpty()
    public oldPassword: string;

    @MaxLength(15, {
        message: 'New Password is maximum 15 character',
    })
    @MinLength(4, {
        message: 'New Password is minimum 4 character',
    })
    @IsNotEmpty({
        message: 'New Password is required',
    })
    public newPassword: string;
}
