/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 absolute management solutions
 * Author absolute management solutions <support@absolute.co.th>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';
export class CreateActionLog {

    @IsNotEmpty()
    public contentId: number;

    @IsNotEmpty()
    public action: string;

    @IsNotEmpty()
    public contentType: string;
}
