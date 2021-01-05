/*
 * NewConsensus API
 * version 1.0
 * Copyright (c) 2019 NewConsensus
 * Author NewConsensus <admin@newconsensus.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty, MinLength} from 'class-validator';

export class FolderNameRequest {
    @IsNotEmpty()
    @MinLength(4, {
        message: 'folder is minimum 4 character',
    })
    public folderName: string;

}
