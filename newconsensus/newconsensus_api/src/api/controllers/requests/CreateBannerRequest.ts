/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateBanner {

    @IsNotEmpty()
    public title: string;

    public content: string;

    public image: string;

    public link: string;

    public position: number;
    @IsNotEmpty()
    public status: number;
}