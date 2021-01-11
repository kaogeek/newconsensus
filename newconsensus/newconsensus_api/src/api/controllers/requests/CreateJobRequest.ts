/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import { IsNotEmpty, IsEmail, MaxLength, MinLength} from 'class-validator';

export class CreateJob {

    @IsNotEmpty()
    public jobTitle: string;

    @IsNotEmpty()
    public jobDescription: string;

    public salaryType: string;

    public jobLocation: string;

    public contactPersonName: string;

    @IsEmail()
    public contactPersonEmail: string;

    @MaxLength(15, {
        message: 'mobile number is maximum 15 character',
    })
    @MinLength(8, {
        message: 'mobile number is minimum 8 character',
    })
    public contactPersonMobile: number;

    @IsNotEmpty()
    public status: number;
}
