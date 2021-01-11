/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty , MaxLength, IsEmail } from 'class-validator';

export class EditProfileRequest {

    @MaxLength(30, {
        message: 'username is maximum 30 character',
    })
    @IsNotEmpty()
    public username: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    public avatar: string;

    @MaxLength(10, {
        message: 'phonenumber is maximum 10 character',
    })
    public phoneNumber: string;

   public address: string;

}
