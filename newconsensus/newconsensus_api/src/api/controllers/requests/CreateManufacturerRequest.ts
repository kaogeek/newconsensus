/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty, MaxLength } from 'class-validator';
export class CreateManufacturer {

    @MaxLength(30, {
        message: 'Name is maximum 30 character',
    })
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public image: string;

    @IsNotEmpty()
    public sortOrder: number;

    @IsNotEmpty()
    public status: number;

}