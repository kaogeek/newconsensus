/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {IsNotEmpty, IsOptional, IsInt, Min} from 'class-validator';
import {Type} from 'class-transformer';

export class PageUserEditProfileRequest {
    // @IsString()
    @IsNotEmpty({
        message: 'First name is required',
    })
    public firstName: string;

    public lastName: string;

    // @IsOptional()
    // @MinLength(5, {
    //     message: 'Old Password is minimum 5 character',
    // })
    // @IsNotEmpty()
    // public password: string;

    // @IsEmail({}, {
    //     message: 'Please provide username as emailId',
    // })
    // @IsNotEmpty({
    //     message: 'Email Id is required',
    // })
    // public emailId: string;

    @IsOptional()
    @IsNotEmpty()
    public mobileNumber: number;
    public avatar: string;

    // req infomation
    @IsNotEmpty()
    public displayName: string;

    @IsInt()
    @IsNotEmpty({
        message: 'gender is required',
    })
    public gender: number;

    @IsNotEmpty({
        message: 'birthday is required',
    })
    @Type(() => Date)
    public birthday: Date;

    @IsNotEmpty({
        message: 'postcode is required',
    })
    @IsInt()
    @Min(5, {
        message: 'postcode minimum 5 character',
    })
    public postcode: number;
    public career: string;
    public education: string;
}
