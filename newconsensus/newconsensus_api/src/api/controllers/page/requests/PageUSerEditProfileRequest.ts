/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
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
