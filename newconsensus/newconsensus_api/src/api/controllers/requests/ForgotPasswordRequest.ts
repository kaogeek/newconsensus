/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { MinLength, MaxLength , IsEmail} from 'class-validator';
export class ForgotPassword {
    @MaxLength(60, {
        message: 'Name is maximum 30 character',
    })
    @MinLength(4, {
        message: 'Name is minimum 4 character',
    })
    @IsEmail()
    public email: string;
}
