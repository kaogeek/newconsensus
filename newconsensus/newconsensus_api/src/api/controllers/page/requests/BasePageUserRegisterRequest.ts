/*
 * @license NewConsensus Platform v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: chalucks <chaluck.s@absolute.co.th>, shiorin <junsuda.s@absolute.co.th>
 */

import 'reflect-metadata';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsEmail, IsOptional, IsInt, Min} from 'class-validator';

export class BasePageUserRegisterRequest {
    @IsNotEmpty({
        message: 'firstName is required',
    })
    public firstName: string;

    @IsNotEmpty({
        message: 'lastName is required',
    })
    public lastName: string;

    @IsEmail({}, {
        message: 'Please provide valid emailId',
    })
    @IsNotEmpty({
        message: 'Email Id is required',
    })
    public emailId: string;

    // info
    public displayName: string;

    @IsInt()
    @IsNotEmpty({
        message: 'gender is required',
    })
    public gender: number; // -1 = N/A 0 = male 1 = female

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
    // @Max(5, {
    //     message: 'postcode maximum 5 character',
    // })
    public postcode: number; // get only postcode to set province

    @IsOptional()
    public avatar: string;

    @IsOptional()
    public phoneNumber: number;

    public identificationCode: string;

    public education: string;

    public career: string;
}
